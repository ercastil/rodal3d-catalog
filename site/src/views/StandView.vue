<template>
  <section class="wrap" style="padding: 28px 0" v-if="s">
    <p class="eyebrow">
      <RouterLink to="/catalog" style="color: var(--gold)">catalog</RouterLink>
      / stand_{{ s.number }}
    </p>
    <h1 class="display" style="font-size: 3rem">{{ s.name }}</h1>
    <p class="lede">
      <em>{{ s.species }}</em> · {{ s.areaHa }} ha · {{ siteMeta.place }} · {{ siteMeta.crs }}
    </p>

    <p class="path" style="margin: 16px 0 24px">
      {{ siteMeta.clusterRoot }}stands/{{ s.id }}/
    </p>

    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px">
      <SensorBadge v-for="k in present" :key="k" :kind="k" />
    </div>
    <StagePipeline :status="s.stages" />

    <div v-if="potreeSrc" class="potree-block">
      <div class="potree-head">
        <div>
          <div class="kicker">point cloud</div>
          <p class="potree-label">{{ s.potree.label }}</p>
        </div>
        <a class="potree-open" :href="potreeSrc" target="_blank" rel="noopener noreferrer">
          open in new tab
        </a>
      </div>
      <iframe
        class="potree-frame"
        :src="potreeSrc"
        :title="`${s.name} Potree viewer`"
        allow="fullscreen"
      ></iframe>
    </div>

    <div class="grid" style="grid-template-columns: 1.2fr 0.8fr; margin-top: 28px">
      <div>
        <StandMap :active-id="s.id" />
        <p v-if="s.ulsNote" class="kicker" style="margin-top: 10px">{{ s.ulsNote }}</p>
      </div>
      <div class="card">
        <div class="kicker">sensors</div>
        <table class="meta">
          <tbody>
            <tr v-for="k in ['TLS', 'MLS', 'ULS']" :key="k">
              <th>{{ k }}</th>
              <td v-if="s.sensors[k]">
                {{ s.scan[k.toLowerCase()] || "—" }}
                · {{ s.sizesGb[k.toLowerCase()] }} G
              </td>
              <td v-else style="color: var(--faint)">none</td>
            </tr>
          </tbody>
        </table>
        <div class="kicker" style="margin-top: 16px">products</div>
        <p v-if="s.products.length" style="margin: 8px 0; color: var(--muted)">
          {{ s.products.join(" · ") }}
        </p>
        <p v-else class="kicker">no derived products yet</p>
        <div v-if="s.experiments.length" style="margin-top: 16px">
          <div class="kicker">experiments</div>
          <RouterLink to="/experiments" style="color: var(--gold)">
            {{ s.experiments.join(", ") }}
          </RouterLink>
        </div>
      </div>
    </div>

    <h2 style="margin: 36px 0 12px; font-size: 1.6rem">Files (mock)</h2>
    <div class="grid" style="grid-template-columns: repeat(3, 1fr)">
      <div v-for="k in ['TLS', 'MLS', 'ULS']" :key="k" class="card">
        <div class="kicker">{{ k }}</div>
        <ul v-if="s.files[k].length" class="files">
          <li v-for="f in s.files[k]" :key="f">
            <code>…/{{ s.id }}/{{ k }}/{{ f }}</code>
          </li>
        </ul>
        <p v-else class="kicker">no {{ k }}</p>
      </div>
    </div>
  </section>
  <section v-else class="wrap" style="padding: 48px 0">
    <p>Stand not found.</p>
    <RouterLink to="/catalog">Back to catalog</RouterLink>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { standById, siteMeta, potreeViewerUrl } from "../data/catalog.js";
import SensorBadge from "../components/SensorBadge.vue";
import StagePipeline from "../components/StagePipeline.vue";
import StandMap from "../components/StandMap.vue";

const props = defineProps({ id: { type: String, required: true } });
const s = computed(() => standById(props.id));
const present = computed(() =>
  s.value ? ["TLS", "MLS", "ULS"].filter((k) => s.value.sensors[k]) : [],
);
const potreeSrc = computed(() =>
  s.value?.potree
    ? potreeViewerUrl(s.value.potree.metadataPath, `${s.value.name} TLS`)
    : null,
);
</script>

<style scoped>
.meta {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  font-size: 0.92rem;
}
.meta th {
  text-align: left;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--faint);
  width: 3.5rem;
  padding: 6px 0;
}
.meta td {
  padding: 6px 0;
  color: var(--muted);
}
.files {
  list-style: none;
  padding: 0;
  margin: 10px 0 0;
}
.files li {
  margin: 0 0 8px;
  font-size: 12px;
  color: var(--muted);
}
.files code {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--gold-2);
}
.potree-block {
  margin: 28px 0 8px;
}
.potree-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}
.potree-label {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 0.92rem;
}
.potree-open {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gold);
  white-space: nowrap;
}
.potree-frame {
  display: block;
  width: 100%;
  height: min(72vh, 720px);
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #111;
}
@media (max-width: 800px) {
  .grid[style] {
    grid-template-columns: 1fr !important;
  }
}
</style>
