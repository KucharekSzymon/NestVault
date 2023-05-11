<template>
  <v-breadcrumbs :items="breadcrumbs">
    <template v-slot:prepend>
      <v-icon size="small" icon="fa-solid fa-home-user"></v-icon>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  computed: {
    breadcrumbs() {
      const matchedRoutes = this.$route.matched;

      // Add a link to the homepage at the beginning of the breadcrumbs
      const homeBreadcrumb = {
        text: "Home",
        to: "/",
      };

      const routeBreadcrumbs = matchedRoutes.map((route) => ({
        text: route.name,
        to: route.path,
      }));

      // Check if the current route is the homepage
      const publicPages = ["/login", "/register", "/"];
      const authRequired = publicPages.includes(this.$route.path);

      // Exclude the "Home" breadcrumb when already on the homepage
      if (authRequired) {
        return routeBreadcrumbs;
      } else {
        return [homeBreadcrumb, ...routeBreadcrumbs];
      }
    },
  },
};
</script>
