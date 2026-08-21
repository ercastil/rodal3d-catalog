<template>
  <div class="map-shell">
    <div ref="el" class="map"></div>
    <div v-if="mode === 'crowns'" class="map-controls">
      <label class="map-ctrl">
        <input type="checkbox" v-model="showBasemap" />
        Satellite
      </label>
      <label class="map-ctrl">
        Map
        <input
          type="range"
          min="0"
          max="100"
          v-model.number="mapAlpha"
          :disabled="!showBasemap"
        />
      </label>
      <label class="map-ctrl">
        Crowns
        <input type="range" min="5" max="95" v-model.number="crownAlpha" />
      </label>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, onBeforeUnmount, ref, watch } from "vue";
import L from "leaflet";
import { useRouter } from "vue-router";
import standsGeo from "../data/stands.geojson";
import fieldTrees from "../data/field_trees.geojson";
import { stands, tlsArchiveDirByStandId } from "../data/catalog.js";
import { theme } from "../theme.js";

const props = defineProps({
  mode: { type: String, default: "polygons" },
  activeId: { type: String, default: "" },
  interactive: { type: Boolean, default: true },
  navigateOnClick: { type: Boolean, default: true },
  scrollWheelZoom: { type: Boolean, default: false },
});

const emit = defineEmits(["select"]);
const el = ref(null);
const router = useRouter();
const showBasemap = ref(true);
const mapAlpha = ref(85);
const crownAlpha = ref(45);

let map;
let tiles;
let polyLayer;
const treeLayers = [];

const CROWN_FILL = "#1D9E75";
const CROWN_STROKE = "#0F6E56";
const TRUNK_FILL = "#C4845A";
const BEZIER_K = 0.5523;
const BEZIER_STEPS = 8;

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function featureStandId(feature) {
  return feature.properties.standId || feature.properties.Nombre;
}

function isPublishedFeature(feature) {
  return Object.hasOwn(tlsArchiveDirByStandId, featureStandId(feature));
}

function standName(standId) {
  return stands.find((s) => s.id === standId)?.name || standId;
}

function finiteNum(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function metersToLatLng(lat, lon, eastM, northM) {
  const mLat = 1 / 111320;
  const mLon = 1 / (111320 * Math.cos((lat * Math.PI) / 180));
  return [lat + northM * mLat, lon + eastM * mLon];
}

function bezier(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
}

function crownLatLngs(lat, lon, n, s, e, o) {
  const curves = [
    [
      [0, n],
      [e * BEZIER_K, n],
      [e, n * BEZIER_K],
      [e, 0],
    ],
    [
      [e, 0],
      [e, -s * BEZIER_K],
      [e * BEZIER_K, -s],
      [0, -s],
    ],
    [
      [0, -s],
      [-o * BEZIER_K, -s],
      [-o, -s * BEZIER_K],
      [-o, 0],
    ],
    [
      [-o, 0],
      [-o, n * BEZIER_K],
      [-o * BEZIER_K, n],
      [0, n],
    ],
  ];
  const ring = [];
  for (const [p0, p1, p2, p3] of curves) {
    for (let i = 0; i < BEZIER_STEPS; i += 1) {
      const [east, north] = bezier(p0, p1, p2, p3, i / BEZIER_STEPS);
      ring.push(metersToLatLng(lat, lon, east, north));
    }
  }
  ring.push(ring[0]);
  return ring;
}

function hasCrown(p) {
  return [p.rc_n, p.rc_s, p.rc_e, p.rc_o].every((v) => finiteNum(v) != null);
}

function trunkRadiusM(dap) {
  if (!dap || dap <= 0) return 0.08;
  return Math.max(0.08, (dap / 100) * 0.5);
}

function fmt(value, unit) {
  if (value == null || Number.isNaN(value)) return "—";
  return `${value} ${unit}`;
}

function tooltipHtml(p) {
  const rc = hasCrown(p)
    ? `N:${p.rc_n} S:${p.rc_s} E:${p.rc_e} O:${p.rc_o}`
    : "—";
  return `<strong>${standName(p.standId)} · ${p.id}</strong><br>DAP: ${fmt(p.dap, "cm")}<br>Altura: ${fmt(p.ht, "m")}<br>Radios (m): ${rc}`;
}

function publishedTrees() {
  return fieldTrees.features.filter((f) => {
    if (!Object.hasOwn(tlsArchiveDirByStandId, f.properties.standId)) return false;
    if (props.mode === "crowns" && props.activeId) {
      return f.properties.standId === props.activeId;
    }
    return true;
  });
}

function treeExtent(feature) {
  const p = feature.properties;
  const [lon, lat] = feature.geometry.coordinates;
  const radii = [p.rc_n, p.rc_s, p.rc_e, p.rc_o]
    .map(finiteNum)
    .filter((v) => v != null);
  const pad = Math.max(2, ...radii);
  return L.latLngBounds(
    metersToLatLng(lat, lon, -pad, -pad),
    metersToLatLng(lat, lon, pad, pad),
  );
}

function polyStyle(feature) {
  const active = Boolean(props.activeId) && featureStandId(feature) === props.activeId;
  const poly = cssVar("--map-poly") || "#2a7a6c";
  const hi = cssVar("--map-active") || "#2f4a3a";
  return {
    color: active ? hi : poly,
    weight: active ? 3 : 2,
    fillColor: active ? hi : poly,
    fillOpacity: active ? 0.42 : 0.28,
  };
}

function crownStyle() {
  return {
    color: CROWN_STROKE,
    weight: 0.7,
    fillColor: CROWN_FILL,
    fillOpacity: crownAlpha.value / 100,
    opacity: 1,
  };
}

function applyBasemap() {
  if (!tiles) return;
  tiles.setOpacity(showBasemap.value ? mapAlpha.value / 100 : 0);
}

function applyCrowns() {
  treeLayers.forEach((tree) => {
    tree.layers.forEach((lyr) => {
      if (lyr instanceof L.Polygon) lyr.setStyle(crownStyle());
    });
  });
}

function selectStand(standId) {
  emit("select", standId);
  if (props.navigateOnClick) {
    router.push({ name: "stand", params: { id: standId } });
  }
}

function bindTree(lyr, standId) {
  lyr.bindTooltip(tooltipHtml(lyr.feature.properties), {
    sticky: true,
    className: "map-tip tree-tip",
    opacity: 1,
  });
  if (!props.interactive) return;
  lyr.on("click", () => selectStand(standId));
}

function addTree(feature) {
  const p = feature.properties;
  const [lon, lat] = feature.geometry.coordinates;
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) return;
  const layers = [];
  const n = finiteNum(p.rc_n);
  const s = finiteNum(p.rc_s);
  const e = finiteNum(p.rc_e);
  const o = finiteNum(p.rc_o);

  if (n != null && s != null && e != null && o != null && n + s + e + o >= 0.5) {
    const crown = L.polygon(crownLatLngs(lat, lon, n, s, e, o), {
      ...crownStyle(),
      interactive: props.interactive,
    });
    crown.feature = feature;
    bindTree(crown, p.standId);
    layers.push(crown);
  } else {
    const fallback = L.circleMarker([lat, lon], {
      radius: 3,
      color: "#888",
      fillColor: "#888",
      fillOpacity: 0.9,
      weight: 0,
      interactive: props.interactive,
    });
    fallback.feature = feature;
    bindTree(fallback, p.standId);
    layers.push(fallback);
  }

  const trunk = L.circle([lat, lon], {
    radius: trunkRadiusM(p.dap),
    color: TRUNK_FILL,
    fillColor: TRUNK_FILL,
    fillOpacity: 1,
    weight: 0,
    pane: "treeTrunks",
    interactive: props.interactive,
  });
  trunk.feature = feature;
  bindTree(trunk, p.standId);
  layers.push(trunk);
  layers.forEach((lyr) => lyr.addTo(map));
  treeLayers.push({ standId: p.standId, layers });
}

function addPolygons() {
  polyLayer = L.geoJSON(standsGeo, {
    filter: isPublishedFeature,
    style: polyStyle,
    onEachFeature(feature, lyr) {
      const id = featureStandId(feature);
      lyr.bindTooltip(standName(id), { sticky: true, className: "map-tip" });
      if (!props.interactive) return;
      lyr.on("click", () => selectStand(id));
    },
  }).addTo(map);
}

function activeBounds() {
  if (props.mode === "polygons") {
    if (!polyLayer) return null;
    if (props.activeId) {
      let found = null;
      polyLayer.eachLayer((lyr) => {
        if (featureStandId(lyr.feature) === props.activeId) found = lyr;
      });
      if (found) return found.getBounds();
    }
    return polyLayer.getBounds();
  }
  const bounds = L.latLngBounds([]);
  publishedTrees().forEach((f) => {
    const [lon, lat] = f.geometry.coordinates;
    if (Number.isFinite(lon) && Number.isFinite(lat)) bounds.extend(treeExtent(f));
  });
  return bounds.isValid() ? bounds : null;
}

function focusActive({ animate = false } = {}) {
  if (!map) return;
  const bounds = activeBounds();
  if (bounds?.isValid()) {
    map.fitBounds(bounds, {
      padding: [36, 36],
      maxZoom: props.mode === "crowns" ? 20 : props.activeId ? 19 : 17,
      animate,
    });
  }
}

onMounted(async () => {
  map = L.map(el.value, {
    zoomControl: true,
    attributionControl: true,
    scrollWheelZoom: props.scrollWheelZoom,
  });
  map.createPane("treeTrunks");
  map.getPane("treeTrunks").style.zIndex = 450;

  tiles = L.tileLayer("https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
    attribution: "© Google",
    maxZoom: 21,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }).addTo(map);
  applyBasemap();

  if (props.mode === "polygons") addPolygons();
  else publishedTrees().forEach(addTree);

  await nextTick();
  map.invalidateSize();
  focusActive({ animate: false });
  requestAnimationFrame(() => {
    map.invalidateSize();
    focusActive({ animate: false });
  });
});

watch(
  () => props.activeId,
  () => {
    if (polyLayer) polyLayer.setStyle(polyStyle);
    focusActive({ animate: true });
  },
);
watch(theme, () => {
  if (polyLayer) polyLayer.setStyle(polyStyle);
});
watch([showBasemap, mapAlpha], applyBasemap);
watch(crownAlpha, applyCrowns);

onBeforeUnmount(() => {
  if (map) map.remove();
});
</script>

<style scoped>
.map-shell {
  position: relative;
  height: 100%;
  min-height: 0;
}
.map-controls {
  position: absolute;
  left: 8px;
  bottom: 8px;
  z-index: 500;
  display: flex;
  flex-wrap: nowrap;
  gap: 10px 14px;
  align-items: center;
  width: max-content;
  max-width: calc(100% - 16px);
  background: color-mix(in srgb, var(--panel) 92%, transparent);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 11px;
  color: var(--muted);
}
.map {
  background: #fff;
}
.map-shell :deep(.leaflet-container) {
  background: #fff;
}
.map-ctrl {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  user-select: none;
}
.map-ctrl input[type="range"] {
  width: 72px;
  accent-color: var(--gold);
}
</style>
