<template>
  <section class="wrap" style="padding: 28px 0">
    <p class="eyebrow">NLHPC cluster</p>
    <h1 class="display" style="font-size: 2.8rem">Data layout</h1>
    <p class="lede">
      Stand first, then sensor, then processing stage. Experiments are not mixed
      with field point clouds.
    </p>

    <div class="card" style="margin-top: 24px">
      <pre class="tree">data/
├── <span class="hl">stands/</span>
│   └── <span class="hl">ruil/</span>                      <span class="c"># stand_id</span>
│       ├── TLS/raw/ …
│       ├── MLS/raw/ …
│       ├── ULS/raw/ …
│       ├── normalized/
│       ├── segmented/
│       ├── fused/
│       └── derived/
├── <span class="hl">experiments/</span>
│   ├── stats/
│   └── research/
│       ├── 3dfin-vs-treex/
│       ├── l-systems/
│       └── reconstruct/</pre>
    </div>

    <h2 style="margin: 36px 0 12px; font-size: 1.5rem">Identifier</h2>
    <p class="lede">
      <code>stand_id</code> is the same on the cluster, in the GeoJSON catalog, in field plots,
      and on this site. Example: <code>ruil</code> opens
      <RouterLink :to="{ name: 'stand', params: { id: 'ruil' } }" style="color: var(--gold)"
        >/stands/ruil</RouterLink
      >.
    </p>
  </section>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
.c {
  color: var(--faint);
}
</style>
