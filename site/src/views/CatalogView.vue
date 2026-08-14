<template>
  <section class="wrap" style="padding: 28px 0">
    <p class="eyebrow">Catalog</p>
    <h1 class="display" style="font-size: 2.8rem">Stands</h1>
    <p class="lede">
      Mock inventory: one record per stand, with available sensors and pipeline status.
    </p>

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
        <h3 style="font-family: var(--serif); font-size: 1.4rem; margin: 6px 0 4px">
          {{ s.name }}
        </h3>
        <p style="color: var(--muted); font-size: 0.88rem; margin: 0 0 10px">
          {{ s.species }}
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
import { stands } from "../data/catalog.js";
import SensorBadge from "../components/SensorBadge.vue";
import StagePipeline from "../components/StagePipeline.vue";

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
