import "@fortawesome/fontawesome-free/css/all.css"; // Ensure your project is capable of handling css files

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
});

export default vuetify;
