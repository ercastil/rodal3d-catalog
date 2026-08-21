<template>
  <div ref="el" class="map"></div>
</template>

<script setup>
import { nextTick, onMounted, onBeforeUnmount, ref, watch } from "vue";
import L from "leaflet";
import { useRouter } from "vue-router";
import fieldTrees from "../data/field_trees.geojson";
import { stands, tlsArchiveDirByStandId } from "../data/catalog.js";

const props = defineProps({
  activeId: { type: String, default: "" },
  interactive: { type: Boolean, default: true },
  navigateOnClick: { type: Boolean, default: true },
  scrollWheelZoom: { type: Boolean, default: false },
});

const emit = defineEmits(["select"]);
const el = ref(null);
const router = useRouter();
let map;
let layer;
const treeLayers = [];

function treeExtent(feature) {
  const p = feature.properties;
  const [lon, lat] = feature.geometry.coordinates;
  const pad = hasCrown(p)
    ? Math.max(p.rc_n, p.rc_s, p.rc_e, p.rc_o, 2)
    : 2;
  return L.latLngBounds(
    metersToLatLng(lat, lon, -pad, -pad),
    metersToLatLng(lat, lon, pad, pad),
  );
}

const CROWN_FILL = "#1D9E75";
const CROWN_STROKE = "#0F6E56";
const TRUNK_FILL = "#C4845A";
const CROWN_OPACITY = 0.45;
const BEZIER_K = 0.5523;
const BEZIER_STEPS = 8;

function publishedTrees() {
  return fieldTrees.features.filter((f) =>
    Object.hasOwn(tlsArchiveDirByStandId, f.properties.standId),
  );
}

function standName(standId) {
  return stands.find((s) => s.id === standId)?.name || standId;
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
  return [p.rc_n, p.rc_s, p.rc_e, p.rc_o].every((v) => v != null);
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

function isActiveStand(standId) {
  return Boolean(props.activeId) && props.activeId === standId;
}

function crownStyle(standId) {
  const active = isActiveStand(standId);
  const dim = Boolean(props.activeId) && !active;
  return {
    color: CROWN_STROKE,
    weight: active ? 1.2 : 0.7,
    fillColor: CROWN_FILL,
    fillOpacity: dim ? 0.16 : CROWN_OPACITY,
    opacity: dim ? 0.35 : 1,
  };
}

function bindSelect(lyr, standId) {
  lyr.bindTooltip(tooltipHtml(lyr.feature.properties), {
    sticky: true,
    className: "map-tip tree-tip",
    opacity: 1,
  });
  if (!props.interactive) return;
  lyr.on("click", () => {
    emit("select", standId);
    if (props.navigateOnClick) {
      router.push({ name: "stand", params: { id: standId } });
    }
  });
}

function addTree(feature) {
  const p = feature.properties;
  const [lon, lat] = feature.geometry.coordinates;
  const layers = [];

  if (hasCrown(p) && p.rc_n + p.rc_s + p.rc_e + p.rc_o >= 0.5) {
    const crown = L.polygon(crownLatLngs(lat, lon, p.rc_n, p.rc_s, p.rc_e, p.rc_o), {
      ...crownStyle(p.standId),
      interactive: props.interactive,
    });
    crown.feature = feature;
    bindSelect(crown, p.standId);
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
    bindSelect(fallback, p.standId);
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
  bindSelect(trunk, p.standId);
  layers.push(trunk);

  layers.forEach((lyr) => layer.addLayer(lyr));
  treeLayers.push({ standId: p.standId, layers });
}

function restyle() {
  treeLayers.forEach((tree) => {
    tree.layers.forEach((lyr) => {
      if (lyr instanceof L.Polygon) {
        lyr.setStyle(crownStyle(tree.standId));
      }
    });
  });
}

function activeBounds() {
  const feats = publishedTrees().filter(
    (f) => !props.activeId || f.properties.standId === props.activeId,
  );
  const bounds = L.latLngBounds([]);
  feats.forEach((f) => bounds.extend(treeExtent(f)));
  return bounds.isValid() ? bounds : null;
}

function focusActive({ animate = false } = {}) {
  if (!map || !layer) return;
  const bounds = activeBounds();
  if (bounds?.isValid()) {
    map.fitBounds(bounds, {
      padding: [36, 36],
      maxZoom: props.activeId ? 20 : 18,
      animate,
    });
  }
}

let tiles;

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

  layer = L.layerGroup().addTo(map);
  publishedTrees().forEach(addTree);

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
    restyle();
    focusActive({ animate: true });
  },
);

onBeforeUnmount(() => {
  if (map) map.remove();
});
</script>
