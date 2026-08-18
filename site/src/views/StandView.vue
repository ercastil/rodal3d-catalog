<template>
  <section class="stand-page" v-if="s">
    <div class="stand-hero">
      <div class="stand-left">
        <div class="stand-summary">
          <p class="eyebrow">
            <RouterLink to="/catalog" style="color: var(--gold)">catalog</RouterLink>
            / {{ s.number }}
          </p>
          <h1>{{ s.name }}</h1>
          <p class="stand-summary-species">
            <em>{{ s.species }}</em>
          </p>
          <p class="stand-summary-meta">
            {{ s.areaHa }} ha · {{ s.group }} · {{ siteMeta.crs }}
          </p>
          <div class="stand-summary-sensors">
            <SensorBadge v-for="k in present" :key="k" :kind="k" />
          </div>
          <StagePipeline :status="s.stages" />
          <p v-if="s.ulsNote" class="kicker stand-summary-note">{{ s.ulsNote }}</p>
        </div>
        <div class="stand-hero-map">
          <StandMap :active-id="s.id" />
        </div>
      </div>

      <div v-if="activeCloud" class="stand-hero-viewer">
        <div class="potree-head">
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
        <div class="kicker">point cloud</div>
        <p class="kicker" style="margin-top: 10px">no Potree cloud yet</p>
      </div>

      <aside class="stand-info">
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
        <p v-if="s.products.length" class="stand-info-text">
          {{ s.products.join(" · ") }}
        </p>
        <p v-else class="kicker">no derived products yet</p>

        <div v-if="s.experiments.length" style="margin-top: 16px">
          <div class="kicker">experiments</div>
          <RouterLink to="/experiments" style="color: var(--gold)">
            {{ s.experiments.join(", ") }}
          </RouterLink>
        </div>

        <div class="kicker" style="margin-top: 18px">files (mock)</div>
        <div v-for="k in ['TLS', 'MLS', 'ULS']" :key="k" class="stand-files-block">
          <div class="kicker">{{ k }}</div>
          <ul v-if="s.files[k].length" class="files">
            <li v-for="f in s.files[k]" :key="f">
              <code>…/{{ s.id }}/{{ k }}/{{ f }}</code>
            </li>
          </ul>
          <p v-else class="kicker">no {{ k }}</p>
        </div>
      </aside>
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
import { standById, siteMeta, potreeViewerUrl, potreeClouds } from "../data/catalog.js";
import SensorBadge from "../components/SensorBadge.vue";
import StagePipeline from "../components/StagePipeline.vue";
import StandMap from "../components/StandMap.vue";

const props = defineProps({ id: { type: String, required: true } });
const s = computed(() => standById(props.id));
const present = computed(() =>
  s.value ? ["TLS", "MLS", "ULS"].filter((k) => s.value.sensors[k]) : [],
);
const activeCloud = computed(() => potreeClouds(s.value)[0] ?? null);
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
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.stand-hero {
  display: grid;
  grid-template-columns: minmax(200px, 18vw) minmax(0, 1fr) minmax(220px, 22vw);
  grid-template-rows: minmax(0, 1fr);
  gap: 8px;
  padding: 8px 10px 10px;
  flex: 1;
  min-height: 0;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
.stand-left {
  display: grid;
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
  gap: 8px;
  min-width: 0;
  min-height: 0;
  height: 100%;
}
.stand-summary {
  min-height: 0;
  overflow: auto;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 12px 14px 14px;
}
.stand-summary h1 {
  font-family: var(--serif);
  font-size: 1.55rem;
  font-weight: 400;
  margin: 6px 0 4px;
  letter-spacing: -0.02em;
}
.stand-summary-species {
  margin: 0 0 6px;
  color: var(--muted);
  font-size: 0.92rem;
}
.stand-summary-meta {
  margin: 0 0 10px;
  color: var(--faint);
  font-size: 0.82rem;
}
.stand-summary-sensors {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}
.stand-summary-note {
  margin: 10px 0 0;
  line-height: 1.4;
}
.stand-hero-map {
  min-height: 0;
  overflow: hidden;
}
.stand-hero-map :deep(.map) {
  height: 100%;
  min-height: 0;
  border-radius: 10px;
}
.stand-hero-viewer,
.stand-hero-fallback {
  min-width: 0;
  min-height: 0;
  height: 100%;
}
.stand-hero-viewer {
  position: relative;
}
.stand-info {
  min-width: 0;
  min-height: 0;
  overflow: auto;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 12px 14px 16px;
}
.stand-info-text {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.45;
}
.stand-files-block {
  margin-top: 10px;
}
.meta {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
  font-size: 0.88rem;
}
.meta th {
  text-align: left;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--faint);
  width: 3.5rem;
  padding: 5px 0;
}
.meta td {
  padding: 5px 0;
  color: var(--muted);
}
.files {
  list-style: none;
  padding: 0;
  margin: 6px 0 0;
}
.files li {
  margin: 0 0 6px;
  font-size: 11px;
  color: var(--muted);
}
.files code {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--gold-2);
  word-break: break-all;
}
.potree-head {
  position: absolute;
  z-index: 2;
  top: 10px;
  right: 10px;
  pointer-events: none;
}
.potree-head > * {
  pointer-events: auto;
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
@media (max-width: 1100px) {
  .stand-hero {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
    grid-template-rows: minmax(0, 1fr) minmax(180px, 32vh);
  }
  .stand-info {
    grid-column: 1 / -1;
  }
}
@media (max-width: 800px) {
  .stand-hero {
    grid-template-columns: 1fr;
    grid-template-rows: auto 42vh minmax(220px, 1fr);
    overflow: auto;
  }
  .stand-hero-map {
    min-height: 180px;
  }
}
</style>
