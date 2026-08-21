<template>
  <div class="dist">
    <div class="dist-head">
      <div class="dist-title">{{ title }}</div>
      <div class="dist-stats">
        {{ meanLabel }}
        <span v-if="sdLabel"> · {{ sdLabel }}</span>
      </div>
    </div>
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
      <span
        v-for="(tick, i) in axisTicks"
        :key="`${tick.value}-${i}`"
        class="dist-tick"
        :class="{ start: i === 0, end: i === axisTicks.length - 1 }"
        :style="{ left: `${tick.pct}%` }"
      >{{ tick.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  unit: { type: String, default: "" },
  mean: { type: Number, default: null },
  sd: { type: Number, default: null },
  dist: {
    type: Object,
    required: true,
  },
});

function fmt(value) {
  if (value == null || Number.isNaN(value)) return "—";
  return value.toFixed(1);
}

const meanLabel = computed(() =>
  props.mean == null ? "—" : `${fmt(props.mean)} ${props.unit}`,
);
const sdLabel = computed(() =>
  props.sd == null ? "" : `sd ${fmt(props.sd)}`,
);

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
const axisTicks = computed(() => {
  const n = props.dist.counts.length;
  const step = props.dist.step || 1;
  if (!n) return [];
  const maxVal = n * step;
  const stride = n <= 8 ? 1 : Math.ceil(n / 7);
  const ticks = [];
  for (let i = 0; i < n; i += stride) {
    ticks.push({
      value: i * step,
      pct: (i / n) * 100,
      label: String(i * step),
    });
  }
  const last = ticks[ticks.length - 1];
  if (!last || last.value !== maxVal) {
    ticks.push({
      value: maxVal,
      pct: 100,
      label: `${maxVal} ${props.unit}`.trim(),
    });
  } else {
    last.label = `${last.value} ${props.unit}`.trim();
  }
  return ticks;
});
</script>

<style scoped>
.dist {
  min-height: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.dist-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 3px;
}
.dist-title {
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted);
}
.dist-stats {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--ink);
  white-space: nowrap;
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
  position: relative;
  height: 12px;
  margin-top: 2px;
  font-family: var(--mono);
  font-size: 8px;
  color: var(--faint);
}
.dist-tick {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  white-space: nowrap;
}
.dist-tick.start {
  transform: none;
}
.dist-tick.end {
  transform: translateX(-100%);
}
</style>
