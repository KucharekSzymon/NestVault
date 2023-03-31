import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
import "@fortawesome/fontawesome-free/css/all.css";
import { aliases, fa } from "vuetify/iconsets/fa";
import { mdi } from "vuetify/iconsets/mdi";
// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";
import { md3 } from "vuetify/blueprints";

const vuetify = createVuetify({
  components,
  directives,
  blueprint: md3,
  ssr: false,
  theme: {
    defaultTheme: "dark",
  },
  icons: {
    defaultSet: "fa",
    aliases,
    sets: {
      mdi,
      fa,
    },
  },
});

export default vuetify;
