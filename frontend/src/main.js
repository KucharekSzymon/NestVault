import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router";
import store from "./store";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import "./assets/main.css";
import setupInterceptors from "./services/setupInterceptors";

const vuetify = createVuetify({
  components,
  directives,
});

setupInterceptors(store);

createApp(App).use(router).use(store).use(vuetify).mount("#app");
