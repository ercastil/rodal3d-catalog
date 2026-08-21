<template>
  <section class="home-shell">
    <div class="home-map">
      <StandMap
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
            <div class="kicker">stand_{{ s.number }} · {{ s.id }}</div>
            <h3>{{ s.name }}</h3>
            <p class="stand-species">
              <em>{{ s.species }}</em>
            </p>
            <span v-for="k in ['TLS', 'MLS', 'ULS']" :key="k">
              <SensorBadge v-if="s.sensors[k]" :kind="k" />
            </span>
            <StagePipeline :status="s.stages" />
            <p class="kicker stand-size">
              {{ sizeLabel(s) }} · {{ s.areaHa }} ha
            </p>
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
import SensorBadge from "../components/SensorBadge.vue";
import StagePipeline from "../components/StagePipeline.vue";
import { publishedStands, totals } from "../data/catalog.js";

const router = useRouter();
const t = totals();
const selectedId = ref("");

function sizeLabel(s) {
  const g = s.sizesGb.tls + s.sizesGb.mls + s.sizesGb.uls;
  return g >= 10 ? `${g.toFixed(0)} G raw` : `${g.toFixed(1)} G raw`;
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
.stand-card .kicker {
  font-size: 9px;
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
.stand-size {
  margin-top: auto;
  padding-top: 4px;
}
.stand-card :deep(.pill) {
  font-size: 9px;
  padding: 1px 5px;
}
.stand-card :deep(.stage-row) {
  margin-top: 5px;
  gap: 4px;
}
.stand-card :deep(.stage) {
  font-size: 8px;
  padding: 1px 4px;
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
