import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue(),
    {
      name: "geojson",
      transform(src, id) {
        if (id.endsWith(".geojson")) {
          return { code: `export default ${src}`, map: null };
        }
      },
    },
  ],
  base: "./",
});
