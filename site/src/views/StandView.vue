<template>
  <section class="stand-page" v-if="s">
    <div class="stand-bar">
      <p class="eyebrow">
        <RouterLink to="/catalog" style="color: var(--gold)">catalog</RouterLink>
        / {{ s.number }}
      </p>
      <h1>{{ s.name }}</h1>
      <p class="stand-bar-meta">
        <em>{{ s.species }}</em>
        · {{ s.areaHa }} ha · {{ siteMeta.crs }}
      </p>
      <div class="stand-bar-sensors">
        <SensorBadge v-for="k in present" :key="k" :kind="k" />
      </div>
    </div>

    <div class="stand-hero">
      <div class="stand-hero-map">
        <StandMap :active-id="s.id" />
      </div>
      <div v-if="clouds.length" class="stand-hero-viewer">
        <div class="potree-head">
          <div class="potree-tabs">
            <button
              v-for="(c, i) in clouds"
              :key="c.metadataPath"
              type="button"
              class="potree-tab"
              :class="{ active: i === selected }"
              @click="selected = i"
            >
              {{ c.label }}
            </button>
          </div>
          <a class="potree-open" :href="potreeSrcGui" target="_blank" rel="noopener noreferrer">
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
      <div v-else class="card stand-hero-fallback">
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
      </div>
    </div>

    <div class="wrap stand-more">
      <p v-if="s.ulsNote" class="kicker" style="margin: 0 0 16px">{{ s.ulsNote }}</p>
      <StagePipeline :status="s.stages" />

      <div class="card" style="margin-top: 20px">
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
    </div>
  </section>
  <section v-else class="wrap" style="padding: 48px 0">
    <p>Stand not found.</p>
    <RouterLink to="/catalog">Back to catalog</RouterLink>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import { standById, siteMeta, potreeViewerUrl, potreeClouds } from "../data/catalog.js";
import SensorBadge from "../components/SensorBadge.vue";
import StagePipeline from "../components/StagePipeline.vue";
import StandMap from "../components/StandMap.vue";

const props = defineProps({ id: { type: String, required: true } });
const s = computed(() => standById(props.id));
const present = computed(() =>
  s.value ? ["TLS", "MLS", "ULS"].filter((k) => s.value.sensors[k]) : [],
);
const clouds = computed(() => potreeClouds(s.value));
const selected = ref(0);
watch(
  () => props.id,
  () => {
    selected.value = 0;
  },
);
const activeCloud = computed(() => clouds.value[selected.value] ?? clouds.value[0] ?? null);
const potreeSrc = computed(() =>
  activeCloud.value
    ? potreeViewerUrl(activeCloud.value.metadataPath, `${s.value.name} TLS`)
    : null,
);
const potreeSrcGui = computed(() =>
  activeCloud.value
    ? potreeViewerUrl(activeCloud.value.metadataPath, `${s.value.name} TLS`, { gui: true })
    : null,
);
</script>

<style scoped>
.stand-page {
  display: flex;
  flex-direction: column;
}
.stand-bar {
  display: flex;
  align-items: baseline;
  gap: 12px 18px;
  flex-wrap: wrap;
  padding: 8px 16px 10px;
}
.stand-bar h1 {
  font-family: var(--serif);
  font-size: 1.45rem;
  font-weight: 400;
  margin: 0;
  letter-spacing: -0.02em;
}
.stand-bar-meta {
  margin: 0;
  color: var(--muted);
  font-size: 0.92rem;
}
.stand-bar-sensors {
  display: flex;
  gap: 8px;
  margin-left: auto;
}
.stand-hero {
  display: grid;
  grid-template-columns: minmax(280px, 22vw) minmax(0, 1fr);
  grid-template-rows: 1fr;
  gap: 8px;
  padding: 0 10px 10px;
  height: calc(100dvh - 7.25rem);
  min-height: 520px;
  align-items: stretch;
}
.stand-hero-map,
.stand-hero-viewer,
.stand-hero-fallback {
  min-height: 0;
  height: 100%;
}
.stand-hero-map :deep(.map) {
  height: 100%;
  border-radius: 10px;
}
.stand-hero-viewer {
  position: relative;
  min-width: 0;
}
.stand-more {
  padding: 28px 0 48px;
}
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
.potree-head {
  position: absolute;
  z-index: 2;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  pointer-events: none;
}
.potree-head > * {
  pointer-events: auto;
}
.potree-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.potree-tab {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  padding: 5px 10px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 999px;
  background: rgba(10, 10, 12, 0.72);
  color: #ddd;
  cursor: pointer;
}
.potree-tab.active {
  border-color: var(--gold);
  color: var(--gold);
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
  height: 100%;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #111;
}
@media (max-width: 900px) {
  .stand-bar-sensors {
    margin-left: 0;
  }
  .stand-hero {
    grid-template-columns: 1fr;
    grid-template-rows: 240px minmax(360px, 1fr);
    height: auto;
    min-height: 0;
  }
  .stand-hero-viewer {
    min-height: 55vh;
  }
}
</style>
