import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "./views/HomeView.vue";
import StandView from "./views/StandView.vue";
import ExperimentsView from "./views/ExperimentsView.vue";

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/catalog", name: "catalog", component: HomeView },
    { path: "/stands/:id", name: "stand", component: StandView, props: true },
    { path: "/experiments", name: "experiments", component: ExperimentsView },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});
