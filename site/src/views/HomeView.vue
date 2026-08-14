<template>
  <section class="wrap" style="padding: 36px 0 8px">
    <div class="grid stats" style="margin: 0 0 32px">
      <div class="stat">
        <b>{{ t.n }}</b>
        <span>stands in catalog</span>
      </div>
      <div class="stat">
        <b>{{ t.withAll }}</b>
        <span>with TLS + MLS + ULS</span>
      </div>
      <div class="stat">
        <b>{{ t.gb }} G</b>
        <span>raw clouds (approx.)</span>
      </div>
      <div class="stat">
        <b>{{ t.ready }}</b>
        <span>segmentation complete</span>
      </div>
    </div>

    <StandMap />
    <p class="kicker" style="margin-top: 10px">
      Polygons from <code>catalog/stands/limites_rodales.geojson</code> · click a stand to open it
    </p>

    <h2 style="margin: 40px 0 14px; font-size: 1.8rem">Catalog</h2>
    <div class="filters">
      <select v-model="sensor">
        <option value="all">All sensors</option>
        <option>TLS</option>
        <option>MLS</option>
        <option>ULS</option>
      </select>
      <select v-model="group">
        <option value="all">All groups</option>
        <option value="broadleaf">Broadleaf</option>
        <option value="conifer">Conifer</option>
        <option value="mixed">Mixed</option>
        <option value="trial">Trial</option>
      </select>
      <select v-model="ready">
        <option value="all">Any stage</option>
        <option value="segmented">Segmentation complete</option>
        <option value="raw-only">Raw only</option>
      </select>
    </div>
    <div class="grid stand-grid">
      <RouterLink
        v-for="s in filtered"
        :key="s.id"
        class="card"
        :to="{ name: 'stand', params: { id: s.id } }"
      >
        <div class="kicker">stand_{{ s.number }} · {{ s.id }}</div>
        <h3 style="font-family: var(--serif); font-size: 1.45rem; margin: 6px 0">
          {{ s.name }}
        </h3>
        <p style="color: var(--muted); font-size: 0.9rem; margin: 0 0 10px">
          <em>{{ s.species }}</em>
        </p>
        <span v-for="k in ['TLS', 'MLS', 'ULS']" :key="k">
          <SensorBadge v-if="s.sensors[k]" :kind="k" />
        </span>
        <StagePipeline :status="s.stages" />
        <p class="kicker" style="margin-top: 12px">
          {{ sizeLabel(s) }} · {{ s.areaHa }} ha
        </p>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import StandMap from "../components/StandMap.vue";
import SensorBadge from "../components/SensorBadge.vue";
import StagePipeline from "../components/StagePipeline.vue";
import { stands, totals } from "../data/catalog.js";

const t = totals();
const sensor = ref("all");
const group = ref("all");
const ready = ref("all");

const filtered = computed(() =>
  stands.filter((s) => {
    if (sensor.value !== "all" && !s.sensors[sensor.value]) return false;
    if (group.value !== "all" && s.group !== group.value) return false;
    if (ready.value === "segmented" && s.stages.segmented !== "done") return false;
    if (ready.value === "raw-only" && s.stages.normalized !== "todo") return false;
    return true;
  }),
);

function sizeLabel(s) {
  const g = s.sizesGb.tls + s.sizesGb.mls + s.sizesGb.uls;
  return g >= 10 ? `${g.toFixed(0)} G raw` : `${g.toFixed(1)} G raw`;
}
</script>

