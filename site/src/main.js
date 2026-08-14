import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "leaflet/dist/leaflet.css";
import "./theme.js";
import "./styles.css";

createApp(App).use(router).mount("#app");
