<template>
  <section class="stand-page" v-if="s">
    <div class="stand-hero">
      <div class="stand-left">
        <div class="stand-summary">
          <h1>{{ s.name }}</h1>
          <p class="stand-summary-species">
            <em>{{ s.species }}</em>
          </p>
          <dl class="stand-stats">
            <div>
              <dt>area</dt>
              <dd>{{ fmtArea(stats.areaHa) }}</dd>
            </div>
            <div>
              <dt>trees</dt>
              <dd>{{ stats.n }}</dd>
            </div>
          </dl>
          <DistChart
            title="height"
            unit="m"
            :dist="dists.ht"
            :mean="stats.meanHt"
            :sd="stats.sdHt"
          />
          <DistChart
            title="DAP"
            unit="cm"
            :dist="dists.dap"
            :mean="stats.meanDap"
            :sd="stats.sdDap"
          />
        </div>
        <div class="stand-hero-map">
          <StandMap
            mode="crowns"
            :active-id="s.id"
            :navigate-on-click="false"
            :scroll-wheel-zoom="true"
          />
        </div>
      </div>

      <div v-if="activeCloud" class="stand-hero-viewer">
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
        <div class="sensor-tabs" role="tablist" aria-label="Sensor archive">
          <button
            v-for="k in sensorTabs"
            :key="k"
            type="button"
            role="tab"
            class="sensor-tab"
            :class="{ active: sensorTab === k }"
            :aria-selected="sensorTab === k"
            @click="sensorTab = k"
          >
            {{ k }}
          </button>
        </div>

        <div v-show="sensorTab === 'TLS'" role="tabpanel">
          <p class="stand-info-text" v-if="s.sensors.TLS">
            {{ s.scan.tls || "—" }} · {{ s.sizesGb.tls }} G
          </p>
          <p v-else class="kicker">no TLS for this stand</p>

          <div class="kicker" style="margin-top: 14px">products</div>
          <p v-if="s.products.length" class="stand-info-text">
            {{ s.products.join(" · ") }}
          </p>
          <p v-else class="kicker">no derived products yet</p>

          <div class="kicker" style="margin-top: 16px">archive</div>
          <p class="stand-access">
            Restricted data. Links open Google Drive; only accounts already
            granted access can open or download.
          </p>
          <p class="stand-access">
            <a class="stand-mail" :href="`mailto:${siteMeta.contactEmail}`">{{
              siteMeta.contactEmail
            }}</a>
          </p>
          <template v-if="archiveDir">
            <table class="meta archive-table">
              <tbody>
                <tr v-for="p in tlsArchiveProducts" :key="p.code">
                  <th>
                    <a
                      v-if="productHref(p.code)"
                      class="archive-code"
                      :href="productHref(p.code)"
                      target="_blank"
                      rel="noopener noreferrer"
                      >{{ p.code }}</a
                    >
                    <span v-else>{{ p.code }}</span>
                  </th>
                  <td>
                    <a
                      v-if="productHref(p.code)"
                      class="archive-link"
                      :href="productHref(p.code)"
                      target="_blank"
                      rel="noopener noreferrer"
                      >{{ p.hint }}</a
                    >
                    <span v-else>{{ p.hint }}</span>
                    <code class="archive-path"
                      >data/stands/{{ archiveDir }}/{{ p.path }}/</code
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
          <p v-else class="kicker stand-access">
            TLS archive not published for this stand yet.
          </p>
        </div>

        <div v-show="sensorTab === 'MLS'" role="tabpanel">
          <p class="stand-info-text" v-if="s.sensors.MLS">
            {{ s.scan.mls || "—" }} · {{ s.sizesGb.mls }} G
          </p>
          <p v-else class="kicker">no MLS for this stand</p>
          <div class="kicker" style="margin-top: 16px">archive</div>
          <p class="kicker stand-access">
            MLS archive not published yet.
          </p>
        </div>

        <div v-show="sensorTab === 'ULS'" role="tabpanel">
          <p class="stand-info-text" v-if="s.sensors.ULS">
            {{ s.scan.uls || "—" }} · {{ s.sizesGb.uls }} G
          </p>
          <p v-else class="kicker">no ULS for this stand</p>
          <p v-if="s.ulsNote" class="kicker stand-access">{{ s.ulsNote }}</p>
          <div class="kicker" style="margin-top: 16px">archive</div>
          <p class="kicker stand-access">
            ULS archive not published yet.
          </p>
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
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import {
  standById,
  siteMeta,
  potreeViewerUrl,
  potreeClouds,
  tlsArchiveProducts,
  tlsArchiveDirByStandId,
  tlsArchiveHref,
  isPublishedStand,
} from "../data/catalog.js";
import { standFieldStats, standDistributions } from "../data/standStats.js";
import DistChart from "../components/DistChart.vue";
import StandMap from "../components/StandMap.vue";

const props = defineProps({ id: { type: String, required: true } });
const s = computed(() => {
  const stand = standById(props.id);
  if (!stand || !isPublishedStand(stand.id)) return null;
  return stand;
});
const stats = computed(() =>
  s.value
    ? standFieldStats(s.value.id)
    : { n: 0, meanDap: null, sdDap: null, meanHt: null, sdHt: null, areaHa: null },
);
const dists = computed(() =>
  s.value
    ? standDistributions(s.value.id)
    : { dap: { labels: [], counts: [], step: 5 }, ht: { labels: [], counts: [], step: 2 } },
);
function fmtArea(ha) {
  if (ha == null) return "—";
  return `${ha.toFixed(3)} ha`;
}
const sensorTabs = ["TLS", "MLS", "ULS"];
const sensorTab = ref("TLS");
const archiveDir = computed(() =>
  s.value ? tlsArchiveDirByStandId[s.value.id] ?? null : null,
);
function productHref(code) {
  return s.value ? tlsArchiveHref(s.value.id, code) : null;
}
const activeCloud = computed(() => potreeClouds(s.value)[0] ?? null);
const potreeSrc = computed(() =>
  activeCloud.value
    ? potreeViewerUrl(activeCloud.value.metadataPath, `${s.value.name} TLS`)
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
  grid-template-rows: minmax(0, 1.15fr) minmax(0, 0.85fr);
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
  padding: 10px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.stand-summary h1 {
  font-family: var(--serif);
  font-size: 1.35rem;
  font-weight: 400;
  margin: 0;
  letter-spacing: -0.02em;
}
.stand-summary-species {
  margin: 0;
  color: var(--muted);
  font-size: 0.8rem;
}
.stand-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 10px;
  margin: 0;
  flex: 0 0 auto;
}
.stand-stats dt {
  font-family: var(--mono);
  font-size: 8px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--faint);
}
.stand-stats dd {
  margin: 0;
  font-size: 0.88rem;
  color: var(--ink);
  line-height: 1.2;
}
.stand-summary :deep(.dist) {
  flex: 1;
  min-height: 0;
}
.stand-summary :deep(.dist-svg) {
  flex: 1;
  height: auto;
  min-height: 32px;
}
.stand-hero-map {
  min-height: 0;
  overflow: hidden;
}
.stand-hero-map :deep(.map-shell) {
  height: 100%;
  min-height: 0;
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
.sensor-tabs {
  display: flex;
  gap: 2px;
  margin: -4px 0 12px;
  border-bottom: 1px solid var(--line);
}
.sensor-tab {
  flex: 1;
  appearance: none;
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  padding: 6px 4px 8px;
  color: var(--faint);
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  cursor: pointer;
}
.sensor-tab.active {
  color: var(--gold);
  border-bottom-color: var(--gold);
}
.stand-info-text {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.45;
}
.stand-access {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 0.82rem;
  line-height: 1.45;
}
.stand-mail {
  color: var(--gold);
  font-family: var(--mono);
  font-size: 0.78rem;
  word-break: break-all;
}
.archive-table {
  margin-top: 10px;
}
.archive-table td {
  vertical-align: top;
}
.archive-link,
.archive-code {
  color: var(--gold);
  text-decoration: none;
}
.archive-link:hover,
.archive-code:hover {
  text-decoration: underline;
}
.archive-table th {
  width: 4.2rem;
}
.archive-path {
  display: block;
  margin-top: 2px;
  font-family: var(--mono);
  font-size: 10px;
  color: var(--faint);
  word-break: break-all;
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
