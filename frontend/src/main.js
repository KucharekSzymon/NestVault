import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router";
import store from "./store";
import vuetify from "./plugins/vuetify";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import { VueReCaptcha } from "vue-recaptcha-v3";

import setupInterceptors from "./services/setupInterceptors";

setupInterceptors(store);

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .use(Toast)
  .use(VueReCaptcha, { siteKey: import.meta.env.VITE_reCAPTHCA_SITE_KEY })
  .mount("#app");
