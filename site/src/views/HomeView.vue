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
            v-for="s in stands"
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
import { nextTick, ref } from "vue";
import { useRouter } from "vue-router";
import StandMap from "../components/StandMap.vue";
import SensorBadge from "../components/SensorBadge.vue";
import StagePipeline from "../components/StagePipeline.vue";
import { stands, totals } from "../data/catalog.js";

const router = useRouter();
const t = totals();
const selectedId = ref("");

function sizeLabel(s) {
  const g = s.sizesGb.tls + s.sizesGb.mls + s.sizesGb.uls;
  return g >= 10 ? `${g.toFixed(0)} G raw` : `${g.toFixed(1)} G raw`;
}

function selectStand(id) {
  selectedId.value = id;
  nextTick(() => {
    document
      .querySelector(`[data-stand="${id}"]`)
      ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
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
  gap: 1vw;
  width: 100%;
  padding: 0.8vw 1.2vw 1vw;
  flex: 1;
  min-height: 0;
  box-sizing: border-box;
}
.home-map {
  min-width: 0;
  min-height: 0;
}
.home-map :deep(.map) {
  height: 100%;
  border-radius: 10px;
}
.home-side {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  gap: 0.8vw;
}
.home-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.6vw;
  flex: 0 0 auto;
}
.home-stats :deep(.stat),
.home-stats .stat {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 6.8rem;
  padding: 1.15vw 1vw;
}
.home-stats .stat b {
  font-size: clamp(1.85rem, 2.5vw, 2.65rem);
  line-height: 1.1;
}
.home-stats .stat span {
  font-size: clamp(0.88rem, 1vw, 1.05rem);
  margin-top: 0.35rem;
}
.home-catalog {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
}
.home-catalog-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.8vw;
  flex-wrap: wrap;
  flex: 0 0 auto;
}
.home-catalog-head h2 {
  margin: 0;
  font-size: clamp(1.2rem, 1.6vw, 1.7rem);
}
.home-stand-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr));
  gap: 0.7vw;
  overflow: auto;
  min-height: 0;
  padding: 0.4vw 0.2vw 0.6vw 0;
  margin-top: 0.5vw;
}
.stand-card {
  cursor: pointer;
}
.stand-card h3 {
  font-family: var(--serif);
  font-size: 1.35rem;
  margin: 6px 0;
}
.stand-species {
  color: var(--muted);
  font-size: 0.9rem;
  margin: 0 0 10px;
}
.stand-size {
  margin-top: 12px;
}
@media (max-width: 900px) {
  .home-shell {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(38vh, 42vh) minmax(0, 1fr);
    min-height: 0;
  }
  .home-stand-grid {
    overflow: visible;
  }
}
</style>
