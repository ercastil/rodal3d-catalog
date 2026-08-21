<template>
  <div ref="el" class="map"></div>
</template>

<script setup>
import { nextTick, onMounted, onBeforeUnmount, ref, watch } from "vue";
import L from "leaflet";
import { useRouter } from "vue-router";
import standsGeo from "../data/stands.geojson";
import { stands, tlsArchiveDirByStandId } from "../data/catalog.js";
import { theme } from "../theme.js";

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

const nameToId = {
  ruil: "ruil",
  sequoia: "sequoia",
  lawson: "lawson_01",
  roble: "roble",
  oregon: "oregon_01",
  tepa: "tepa",
  alerce: "alerce",
};

function geoNameFor(standId) {
  const stand = stands.find((s) => s.id === standId);
  if (!stand) return standId;
  if (stand.mapName) return stand.mapName;
  if (nameToId[stand.id]) return stand.id;
  const base = stand.id.split("_")[0];
  return nameToId[base] ? base : stand.id;
}

function isActiveFeature(feature) {
  if (!props.activeId) return false;
  const nombre = feature.properties.Nombre;
  return geoNameFor(props.activeId) === nombre || props.activeId === nombre;
}

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function styleFor(feature) {
  const active = isActiveFeature(feature);
  const poly = cssVar("--map-poly") || "#2a7a6c";
  const hi = cssVar("--map-active") || "#2f4a3a";
  return {
    color: active ? hi : poly,
    weight: active ? 3 : 2,
    fillColor: active ? hi : poly,
    fillOpacity: active ? 0.42 : 0.28,
  };
}

function bind(feature, lyr) {
  const nombre = feature.properties.Nombre;
  const id = nameToId[nombre] || nombre;
  const stand = stands.find((s) => s.id === id);
  lyr.bindTooltip(stand ? `${stand.name}` : nombre, {
    sticky: true,
    className: "map-tip",
  });
  if (props.interactive) {
    lyr.on("click", () => {
      emit("select", id);
      if (props.navigateOnClick) {
        router.push({ name: "stand", params: { id } });
      }
    });
  }
}

function activeLayer() {
  if (!layer || !props.activeId) return null;
  const name = geoNameFor(props.activeId);
  let found = null;
  layer.eachLayer((lyr) => {
    if (lyr.feature?.properties?.Nombre === name) found = lyr;
  });
  return found;
}

function focusActive({ animate = false } = {}) {
  if (!map) return;
  const lyr = activeLayer();
  if (lyr) {
    map.fitBounds(lyr.getBounds(), {
      padding: [40, 40],
      maxZoom: 19,
      animate,
    });
    return;
  }
  if (layer?.getBounds().isValid()) {
    map.fitBounds(layer.getBounds(), { padding: [28, 28], maxZoom: 17, animate });
  }
}

let tiles;

onMounted(async () => {
  map = L.map(el.value, {
    zoomControl: true,
    attributionControl: true,
    scrollWheelZoom: props.scrollWheelZoom,
  });
  tiles = L.tileLayer("https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
    attribution: "© Google",
    maxZoom: 21,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }).addTo(map);

  layer = L.geoJSON(standsGeo, {
    filter(feature) {
      const id = nameToId[feature.properties.Nombre] || feature.properties.Nombre;
      return Object.hasOwn(tlsArchiveDirByStandId, id);
    },
    style: styleFor,
    onEachFeature: bind,
  }).addTo(map);

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
    if (layer) layer.setStyle(styleFor);
    focusActive({ animate: true });
  },
);

watch(theme, () => {
  if (layer) layer.setStyle(styleFor);
});

onBeforeUnmount(() => {
  if (map) map.remove();
});
</script>
