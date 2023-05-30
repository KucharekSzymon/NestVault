const { defineConfig } = require("cypress");

module.exports = defineConfig({
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },

  e2e: {
    baseUrl: "http://localhost",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
