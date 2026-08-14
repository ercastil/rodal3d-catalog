<template>
  <span class="pill" :class="kind.toLowerCase()">{{ kind }}</span>
</template>

<script setup>
defineProps({
  kind: { type: String, required: true },
});
</script>
