<template>
  <div id="app">
    <nav>
      <a href="/">File Server</a>
      <div>
        <li>
          <router-link to="/home"> </router-link>
        </li>
        <li v-if="showAdminBoard">
          <router-link to="/admin">Admin Board</router-link>
        </li>
        <li>
          <router-link v-if="currentUser" to="/user">User</router-link>
        </li>
      </div>

      <div v-if="!currentUser">
        <li>
          <router-link to="/register">
            <font-awesome-icon icon="user-plus" /> Sign Up
          </router-link>
        </li>
        <li>
          <router-link to="/login"> Login </router-link>
        </li>
      </div>

      <div v-if="currentUser">
        <li>
          <router-link to="/profile">
            {{ currentUser.name }}
          </router-link>
        </li>
        <li>
          <a @click.prevent="logOut"> LogOut </a>
        </li>
      </div>
    </nav>

    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser.admin) {
        return this.currentUser.admin;
      }

      return false;
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
    },
  },
};
</script>
