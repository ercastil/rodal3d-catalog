<template>
  <svg
    v-if="points"
    class="stand-thumb"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
  >
    <polygon :points="points" />
  </svg>
</template>

<script setup>
import { computed } from "vue";
import { standPolygon } from "../data/standStats.js";

const props = defineProps({
  standId: { type: String, required: true },
});

function ringsOf(geom) {
  if (!geom) return [];
  if (geom.type === "Polygon") return geom.coordinates;
  if (geom.type === "MultiPolygon") return geom.coordinates.flat();
  return [];
}

const points = computed(() => {
  const feat = standPolygon(props.standId);
  const ring = ringsOf(feat?.geometry)[0];
  if (!ring?.length) return "";
  const xs = ring.map((p) => p[0]);
  const ys = ring.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const span = Math.max(maxX - minX, maxY - minY) || 1;
  const pad = span * 0.12;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const size = span + pad * 2;
  return ring
    .map(([x, y]) => {
      const px = ((x - cx) / size + 0.5) * 100;
      const py = (0.5 - (y - cy) / size) * 100;
      return `${px.toFixed(2)},${py.toFixed(2)}`;
    })
    .join(" ");
});
</script>

<style scoped>
.stand-thumb {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}
.stand-thumb polygon {
  fill: color-mix(in srgb, var(--map-poly) 38%, transparent);
  stroke: var(--map-poly);
  stroke-width: 1.6;
  stroke-linejoin: round;
}
</style>
