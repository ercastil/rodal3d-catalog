import { ref, watch } from "vue";

const KEY = "rodal3d-theme-v2";

export const palettes = [
  { id: "heather", label: "Heather" },
  { id: "musgo", label: "Moss" },
  { id: "pizarra", label: "Slate" },
  { id: "ember", label: "Ember" },
  { id: "pine", label: "Pine" },
];

export const theme = ref(
  typeof localStorage !== "undefined" && palettes.some((p) => p.id === localStorage.getItem(KEY))
    ? localStorage.getItem(KEY)
    : "heather",
);

export function applyTheme(id) {
  theme.value = id;
}

watch(
  theme,
  (id) => {
    document.documentElement.dataset.theme = id;
    localStorage.setItem(KEY, id);
  },
  { immediate: true },
);
