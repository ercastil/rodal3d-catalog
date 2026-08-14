<template>
  <section class="wrap" style="padding: 28px 0">
    <p class="eyebrow">Research</p>
    <h1 class="display" style="font-size: 2.8rem">Experiments</h1>
    <p class="lede">
      Kept separate from field stands. Comparisons, models, and reconstruction live
      under <code>data/experiments/</code>.
    </p>

    <div class="exp-list">
      <article v-for="e in experiments" :key="e.id" class="card exp-card">
        <div class="exp-copy">
          <div class="kicker">{{ e.kind }}</div>
          <h2>{{ e.title }}</h2>
          <p class="path">{{ e.path }}</p>
          <p class="exp-summary">{{ e.summary }}</p>
          <p v-if="e.stands.length" class="exp-stands">
            <RouterLink
              v-for="id in e.stands"
              :key="id"
              :to="{ name: 'stand', params: { id } }"
              class="pill"
            >
              {{ id }}
            </RouterLink>
          </p>
          <ul class="files">
            <li v-for="a in e.artifacts" :key="a.name">
              <code>{{ a.name }}</code>
              <span class="kicker"> — {{ a.note }}</span>
            </li>
          </ul>
        </div>
        <figure v-if="figures[e.figure]" class="exp-figure">
          <img :src="figures[e.figure]" :alt="e.figureCaption" />
          <figcaption>{{ e.figureCaption }}</figcaption>
        </figure>
      </article>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { experiments } from "../data/catalog.js";
import compareDashboard from "../assets/experiments/compare-dashboard.png";
import lsystems from "../assets/experiments/lsystems-real-vs-synth.png";
import reconstruct from "../assets/experiments/reconstruct-reeb.png";

const figures = {
  "compare-dashboard": compareDashboard,
  lsystems,
  reconstruct,
};
</script>

<style scoped>
.exp-list {
  display: grid;
  gap: 18px;
  margin-top: 28px;
}
.exp-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 22px;
  align-items: start;
}
.exp-copy h2 {
  font-family: var(--serif);
  font-size: 1.8rem;
  margin: 8px 0;
}
.exp-summary {
  color: var(--muted);
  margin: 0 0 12px;
}
.exp-stands {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 10px 0;
}
.files {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
}
.files li {
  margin: 6px 0;
}
.files code {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--gold-2);
}
.exp-figure {
  margin: 0;
}
.exp-figure img {
  display: block;
  width: 100%;
  height: 100%;
  max-height: 380px;
  object-fit: contain;
  background: var(--bg-2);
  border: 1px solid var(--line);
}
.exp-figure figcaption {
  margin-top: 8px;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--faint);
}
@media (max-width: 800px) {
  .exp-card {
    grid-template-columns: 1fr;
  }
}
</style>
