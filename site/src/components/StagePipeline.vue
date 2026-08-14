<template>
  <div class="stage-row">
    <span v-for="s in stages" :key="s.id" class="stage" :class="status[s.id]">
      {{ s.label }}
    </span>
  </div>
</template>

<script setup>
import { stages } from "../data/catalog.js";

defineProps({
  status: { type: Object, required: true },
});
</script>
