<template>
  <v-app id="app">
    <v-navigation-drawer v-model="drawer" expand-on-hover rail>
      <v-list v-if="!currentUser" nav>
        <router-link class="text-decoration-none" to="/login">
          <v-list-item
            prepend-icon="fa-regular fa-star"
            title="Sign in"
            value="login"
          />
        </router-link>
        <router-link class="text-decoration-none" to="/register">
          <v-list-item
            prepend-icon="fa-solid fa-star"
            title="Sign Up"
            value="register"
          />
        </router-link>
      </v-list>
      <v-list v-if="currentUser" nav>
        <router-link class="text-decoration-none" to="/user/profile">
          <v-list-item
            prepend-icon="fa fa-user"
            :title="currentUser.name"
            :subtitle="currentUser.email"
            value=""
          ></v-list-item>
        </router-link>
        <v-divider />
        <router-link class="text-decoration-none" to="/files/mine">
          <v-list-item
            prepend-icon="fa:fas fa-folder"
            title="My Files"
            value="myfiles"
          ></v-list-item>
        </router-link>
        <router-link class="text-decoration-none" to="/files/sharedwithme">
          <v-list-item
            prepend-icon="fas fa-share"
            title="Shared with me"
            value="shared"
          ></v-list-item>
        </router-link>
        <v-list-item
          prepend-icon="fas fa-star"
          title="Starred"
          value="starred"
        ></v-list-item>
        <v-divider />

        <router-link
          v-if="currentRole"
          class="text-decoration-none"
          to="/admin/dashboard/"
        >
          <v-list-item
            prepend-icon="fa-solid fa-screwdriver-wrench"
            title="Admin board"
            value="admin"
          />
        </router-link>
        <router-link class="text-decoration-none" to="/user/dashboard">
          <v-list-item
            prepend-icon="fa-solid fa-info"
            title="User panel"
            value="user"
          >
          </v-list-item>
        </router-link>
        <v-divider />

        <a v-if="currentUser" @click.prevent="logOut">
          <v-list-item
            prepend-icon="fa fa-right-from-bracket "
            title="Logout"
            value="Logout"
          ></v-list-item>
        </a>
        <v-divider></v-divider>
        <v-list-item
          :prepend-icon="
            theme.global.current.value.dark ? 'fa fa-sun' : 'fa fa-moon'
          "
          @click="toggleTheme"
          title="Change theme"
        >
        </v-list-item>
        <v-list-item
          prepend-icon="fa-regular fa-hard-drive"
          :title="convertSize(spaceUsed) + ' / ' + convertSize(spaceLimit)"
          v-if="currentUser"
        >
        </v-list-item>
        <v-list-item height="3">
          <v-progress-linear
            v-model="dataUsagePercentage"
            :indeterminate="storageLoading"
            absolute
            bottom
            rounded
            height="3"
            :color="storageColor"
          ></v-progress-linear>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <BreadcrumbsList />
      <v-container fluid>
        <v-card>
          <router-view />
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import eventBus from "./common/eventBus";
import { useTheme } from "vuetify";
import filesService from "./services/files.service";
import BreadcrumbsList from "./components/Common/BreadcrumbsList.vue";

export default {
  data() {
    return {
      drawer: null,
      loading: true,
      storageLoading: true,
    };
  },
  setup() {
    const theme = useTheme();
    return {
      theme,
      toggleTheme: () =>
        (theme.global.name.value = theme.global.current.value.dark
          ? "light"
          : "dark"),
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    currentRole() {
      return this.$store.state.role.isAdmin;
    },
    spaceUsed() {
      return this.$store.state.files.spaceUsed;
    },
    spaceLimit() {
      return this.$store.state.files.spaceLimit;
    },
    dataUsagePercentage() {
      return this.$store.state.files.spaceLeft;
    },
    storageColor() {
      return this.$store.state.files.storageColor;
    },
  },
  methods: {
    async updateSpaceUsage() {
      this.storageLoading = true;
      if (this.currentUser)
        await this.$store.dispatch("files/fetchStorageUsage");
      this.storageLoading = false;
    },

    async updateRole() {
      if (this.currentUser) await this.$store.dispatch("role/fetchRole");
    },
    convertSize(size) {
      return filesService.convertSize(size);
    },
    logOut() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
    },
  },
  mounted() {
    this.updateRole();
    this.updateSpaceUsage();
    eventBus.on("logout", () => {
      this.logOut();
    });
  },
  beforeUnmount() {
    eventBus.remove("logout");
  },
  watch: {
    currentUser: async function (newUser) {
      if (newUser) {
        await this.updateRole();
        await this.updateSpaceUsage();
      } else {
        this.isAdmin = false;
      }
    },
  },
  components: { BreadcrumbsList },
};
</script>
