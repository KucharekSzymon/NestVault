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

        <v-list-item
          prepend-icon="fas fa-share"
          title="Shared with me"
          value="shared"
        ></v-list-item>
        <v-list-item
          prepend-icon="fas fa-star"
          title="Starred"
          value="starred"
        ></v-list-item>
        <v-divider />

        <router-link
          v-if="isAdmin"
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
          prepend-icon="fa-regular fa-hard-drive"
          :title="
            'Used ' + convertSize(spaceUsed) + ' / ' + convertSize(spaceLimit)
          "
          v-if="currentUser"
        >
        </v-list-item>
        <v-list-item
          :prepend-icon="
            theme.global.current.value.dark ? 'fa fa-sun' : 'fa fa-moon'
          "
          @click="toggleTheme"
          title="Change theme"
        >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
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
import AuthService from "./services/auth.service";

export default {
  data() {
    return {
      drawer: null,
      loading: true,
      isAdmin: false,
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
    spaceUsed() {
      return this.$store.state.files.spaceUsed;
    },
    spaceLimit() {
      return this.$store.state.files.spaceLimit;
    },
    dataUsagePercentage() {
      return (this.spaceUsed() / this.spaceLimit) * 100;
    },
  },
  methods: {
    async checkAdminRole() {
      if (this.currentUser)
        try {
          this.isAdmin = await AuthService.checkRole();
        } catch (error) {
          console.log(error);
        }
    },
    async updateSpaceUsage() {
      await this.$store.dispatch("files/fetchStorageUsage");
    },
    convertSize(size) {
      var fileSizeInMb = size / (1024 * 1024);
      var fileSizeInGb = size / (1024 * 1024 * 1024);

      return fileSizeInGb >= 1
        ? fileSizeInGb.toFixed(2) + "Gb"
        : fileSizeInMb.toFixed(2) + "Mb";
    },

    logOut() {
      this.$store.dispatch("auth/logout");
      this.isAdmin = false;
      this.$router.push("/login");
    },
  },
  mounted() {
    this.checkAdminRole;
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
        await this.checkAdminRole();
        await this.updateSpaceUsage();
      } else {
        this.isAdmin = false;
      }
    },
  },
};
</script>
