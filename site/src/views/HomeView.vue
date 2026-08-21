<template>
  <section class="home-shell">
    <div class="home-map">
      <StandMap
        mode="polygons"
        :active-id="selectedId"
        :navigate-on-click="false"
        :scroll-wheel-zoom="true"
        @select="onMapSelect"
      />
    </div>

    <div class="home-side">
      <div class="home-stats">
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

      <div class="home-catalog">
        <div class="home-catalog-head">
          <h2>Catalog</h2>
        </div>

        <div class="home-stand-grid">
          <article
            v-for="s in publishedStands"
            :key="s.id"
            :data-stand="s.id"
            class="card stand-card"
            :class="{ selected: s.id === selectedId }"
            tabindex="0"
            @click="onCardClick(s.id)"
            @dblclick="openStand(s.id)"
            @keydown.enter.prevent="openStand(s.id)"
          >
            <h3>{{ s.name }}</h3>
            <p class="stand-species">
              <em>{{ s.species }}</em>
            </p>
            <div class="stand-thumb-wrap">
              <StandThumb :stand-id="s.id" />
            </div>
            <dl class="stand-stats">
              <div>
                <dt>area</dt>
                <dd>{{ fmtArea(statsFor(s.id).areaHa) }}</dd>
              </div>
              <div>
                <dt>trees</dt>
                <dd>{{ statsFor(s.id).n }}</dd>
              </div>
              <div>
                <dt>mean height</dt>
                <dd>{{ fmtNum(statsFor(s.id).meanHt, "m") }}</dd>
              </div>
              <div>
                <dt>mean DAP</dt>
                <dd>{{ fmtNum(statsFor(s.id).meanDap, "cm") }}</dd>
              </div>
            </dl>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import StandMap from "../components/StandMap.vue";
import StandThumb from "../components/StandThumb.vue";
import { publishedStands, totals } from "../data/catalog.js";
import { standFieldStats } from "../data/standStats.js";

const router = useRouter();
const t = totals();
const selectedId = ref("");
const statsCache = Object.fromEntries(
  publishedStands.map((s) => [s.id, standFieldStats(s.id)]),
);

function statsFor(id) {
  return statsCache[id] || { n: 0, meanDap: null, meanHt: null, areaHa: null };
}

function fmtArea(ha) {
  if (ha == null) return "—";
  return `${ha.toFixed(3)} ha`;
}

function fmtNum(value, unit) {
  if (value == null) return "—";
  return `${value.toFixed(1)} ${unit}`;
}

function selectStand(id) {
  selectedId.value = id;
}

function openStand(id) {
  router.push({ name: "stand", params: { id } });
}

function onMapSelect(id) {
  if (selectedId.value === id) openStand(id);
  else selectStand(id);
}

function onCardClick(id) {
  if (selectedId.value === id) openStand(id);
  else selectStand(id);
}
</script>

<style scoped>
.home-shell {
  display: grid;
  grid-template-columns: minmax(0, 0.98fr) minmax(0, 1.17fr);
  grid-template-rows: minmax(0, 1fr);
  gap: 1vw;
  width: 100%;
  padding: 0.8vw 1.2vw 1vw;
  flex: 1;
  min-height: 0;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
.home-map {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
.home-map :deep(.map-shell) {
  height: 100%;
  min-height: 0;
}
.home-map :deep(.map) {
  height: 100%;
  min-height: 0;
  border-radius: 10px;
}
.home-side {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  gap: 0.8vw;
}
.home-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.45vw;
  flex: 0 0 auto;
}
.home-stats :deep(.stat),
.home-stats .stat {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 0;
  padding: 0.5vw 0.65vw;
}
.home-stats .stat b {
  font-size: clamp(1.35rem, 1.7vw, 1.85rem);
  line-height: 1.1;
}
.home-stats .stat span {
  font-size: clamp(0.7rem, 0.78vw, 0.84rem);
  margin-top: 0.12rem;
}
.home-catalog {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
  overflow: hidden;
}
.home-catalog-head {
  display: flex;
  align-items: baseline;
  gap: 0.8vw;
  flex: 0 0 auto;
  margin-bottom: 0.25vw;
}
.home-catalog-head h2 {
  margin: 0;
  font-size: clamp(0.95rem, 1.15vw, 1.2rem);
}
.home-stand-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  gap: 0.4vw;
  overflow: hidden;
  min-height: 0;
  flex: 1;
  padding: 0;
  margin: 0;
}
.stand-card {
  cursor: pointer;
  padding: 0.4vw 0.5vw 0.45vw;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.stand-card h3 {
  font-family: var(--serif);
  font-size: clamp(0.95rem, 1.05vw, 1.15rem);
  margin: 2px 0 1px;
  line-height: 1.15;
}
.stand-species {
  color: var(--muted);
  font-size: clamp(0.68rem, 0.72vw, 0.78rem);
  margin: 0 0 4px;
  line-height: 1.2;
}
.stand-thumb-wrap {
  flex: 1;
  min-height: 0;
  margin: 2px 0 6px;
}
.stand-card.selected :deep(.stand-thumb polygon) {
  fill: color-mix(in srgb, var(--map-active) 42%, transparent);
  stroke: var(--map-active);
}
.stand-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px 8px;
  margin: 0;
  flex: 0 0 auto;
}
.stand-stats div {
  min-width: 0;
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
  font-size: clamp(0.72rem, 0.85vw, 0.88rem);
  color: var(--ink);
  line-height: 1.2;
}
@media (max-width: 1200px) {
  .home-stand-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 900px) {
  .home-shell {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(32vh, 38vh) minmax(0, 1fr);
    min-height: 0;
    overflow: hidden;
  }
  .home-stand-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    overflow: auto;
  }
}
</style>
