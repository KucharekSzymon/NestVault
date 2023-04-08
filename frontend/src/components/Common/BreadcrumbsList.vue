<template>
  <v-breadcrumbs :items="breadcrumbs">
    <template v-slot:prepend>
      <v-icon size="small" icon="mdi-vuetify"></v-icon>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  data() {
    return {
      breadcrumbs: [],
    };
  },
  methods: {
    updatePaths() {
      /**
       * Splitting path by slash and filter empty strings
       */
      const paths = window.location.pathname.split("/").filter(Boolean);

      /**
       * Looping through path for breadcrubs
       */
      this.breadcrumbs = paths.map((path, index) => {
        return {
          text: path,
          href: "/" + paths.slice(0, index + 1).join("/"),
        };
      });
    },
  },
  mounted() {
    this.updatePaths();
  },
  created() {
    /**
     * Watcher for route changes
     */
    this.$router.afterEach(() => {
      this.updatePaths();
    });

    /**
     * ALternative as event listnerer on change in browser path
     */
    window.addEventListener("popstate", () => {
      this.updatePaths();
    });
  },
};
</script>
