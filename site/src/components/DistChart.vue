<template>
  <div class="dist">
    <div class="dist-title">{{ title }}</div>
    <svg
      class="dist-svg"
      :viewBox="`0 0 ${w} ${h}`"
      preserveAspectRatio="none"
      role="img"
      :aria-label="title"
    >
      <rect
        v-for="(c, i) in dist.counts"
        :key="i"
        :x="pad + i * barW + gap"
        :y="padTop + innerH - (maxCount ? (c / maxCount) * innerH : 0)"
        :width="Math.max(0.4, barW - gap * 2)"
        :height="maxCount ? (c / maxCount) * innerH : 0"
      />
    </svg>
    <div class="dist-axis">
      <span>{{ dist.labels[0] ?? "0" }}</span>
      <span>{{ axisEnd }} {{ unit }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  unit: { type: String, default: "" },
  dist: {
    type: Object,
    required: true,
  },
});

const w = 100;
const h = 36;
const pad = 1;
const padTop = 2;
const innerH = h - padTop - 2;
const maxCount = computed(() => Math.max(0, ...props.dist.counts));
const barW = computed(() =>
  props.dist.counts.length ? (w - pad * 2) / props.dist.counts.length : 0,
);
const gap = 0.15;
const axisEnd = computed(() => {
  const n = props.dist.counts.length;
  if (!n) return "0";
  return String(n * props.dist.step);
});
</script>

<style scoped>
.dist {
  min-height: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.dist-title {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--faint);
  margin-bottom: 3px;
}
.dist-svg {
  display: block;
  width: 100%;
  height: 48px;
  min-height: 40px;
}
.dist-svg rect {
  fill: color-mix(in srgb, var(--gold) 55%, var(--panel));
  stroke: var(--gold);
  stroke-width: 0.25;
}
.dist-axis {
  display: flex;
  justify-content: space-between;
  font-family: var(--mono);
  font-size: 8px;
  color: var(--faint);
  margin-top: 2px;
}
</style>
