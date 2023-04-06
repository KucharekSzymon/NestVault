<template>
  <div v-if="currentUser" class="container">
    <header>
      <h3>
        <strong>{{ currentUser.name }}</strong> Profile
      </h3>
    </header>
    <p>
      <strong>Access token:</strong>
      {{ currentUser.accessToken.substring(0, 20) }} ...
      {{ currentUser.accessToken.substr(currentUser.accessToken.length - 20) }}
    </p>
    <p>
      <strong>Refresh token:</strong>
      {{ currentUser.refreshToken.substring(0, 20) }} ...
      {{ currentUser.refreshToken.substr(currentUser.accessToken.length - 20) }}
    </p>
    <p>
      <strong>Email:</strong>
      {{ currentUser.email }}
    </p>
    <p v-if="currentUser.admin == true">
      <strong>Admin:</strong>
      {{ currentUser.admin }}
    </p>
  </div>
</template>

<script>
export default {
  name: "ProfilePage",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
  },
};
</script>
