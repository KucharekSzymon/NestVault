<template>
  <v-app :theme="theme">
    <div class="fixed-top-right">
      <v-slide-x-reverse-transition mode="out-in">
        <v-btn
          v-if="isMobile"
          :icon="drawer ? 'fa fa-xmark' : 'fa fa-hamburger'"
          @click="toggleDrawer"
        />
      </v-slide-x-reverse-transition>
    </div>
    <v-navigation-drawer
      v-model="drawer"
      :expand-on-hover="!isMobile"
      :rail="!isMobile"
      class="d-flex flex-column"
      style="height: 100vh"
      :temporary="isMobile"
    >
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
        <v-list-item
          :prepend-icon="currentRole ? 'fa fa-user-shield' : 'fa fa-user'"
          :title="currentUser.name"
          :subtitle="currentUser.email"
        ></v-list-item>
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
        <RouterLink class="text-decoration-none" to="/user/share-codes">
          <v-list-item
            prepend-icon="fas fa-share-from-square"
            title="Share Codes"
            value="shareCodes"
          ></v-list-item>
        </RouterLink>
        <v-divider />

        <router-link
          v-if="currentRole"
          class="text-decoration-none"
          to="/admin/"
        >
          <v-list-item
            prepend-icon="fa-solid fa-screwdriver-wrench"
            title="Admin board"
            value="admin"
          />
        </router-link>
        <router-link class="text-decoration-none" to="/user/">
          <v-list-item
            prepend-icon="fa-solid fa-info"
            title="User panel"
            value="user"
          >
          </v-list-item>
        </router-link>
      </v-list>
      <v-list nav class="mt-auto">
        <v-progress-linear
          v-if="currentUser"
          v-model="dataUsagePercentage"
          :indeterminate="storageLoading"
          absolute
          bottom
          rounded
          height="3"
          :color="storageColor"
        ></v-progress-linear>

        <v-list-item
          prepend-icon="fa-regular fa-hard-drive"
          :title="convertSize(spaceUsed) + ' / ' + convertSize(spaceLimit)"
          v-if="currentUser"
        >
        </v-list-item>
        <v-list-item
          :prepend-icon="darkTheme ? 'fa fa-sun' : 'fa fa-moon'"
          @click="setDarkTheme(!darkTheme)"
          title="Change theme"
        >
        </v-list-item>
        <v-divider v-if="currentUser"></v-divider>
        <a v-if="currentUser" @click.prevent="logOut">
          <v-list-item
            prepend-icon="fa fa-right-from-bracket "
            title="Logout"
          ></v-list-item>
        </a>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <BreadcrumbsList />
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import eventBus from "./common/eventBus";
import filesService from "./services/files.service";
import BreadcrumbsList from "./components/Common/BreadcrumbsList.vue";
import { useToast } from "vue-toastification";

export default {
  data() {
    return {
      drawer: null,
      loading: true,
      storageLoading: true,
      darkTheme: false,
      isMobile: false,
    };
  },
  computed: {
    theme() {
      return this.darkTheme ? "dark" : "light";
    },
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
      if (this.isMobile) this.storageLoading = true;
      if (this.currentUser)
        await this.$store.dispatch("files/fetchStorageUsage");
      this.storageLoading = false;
    },
    setDarkTheme(darkTheme) {
      this.darkTheme = darkTheme;
      localStorage.setItem("darkTheme", darkTheme.toString());
    },
    async updateRole() {
      if (this.currentUser) await this.$store.dispatch("role/fetchRole");
    },
    convertSize(size) {
      return filesService.convertSize(size);
    },
    logOut() {
      const toast = useToast();
      toast("Signed out");
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
    },
    isMobileDevice() {
      const mobileBreakpoint = 1280; // Set your desired breakpoint for mobile devices

      return window.innerWidth < mobileBreakpoint;
    },
    handleWindowResize() {
      this.isMobile = this.isMobileDevice();
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
  },
  created() {
    const storedDarkTheme = localStorage.getItem("darkTheme");
    if (storedDarkTheme !== null) {
      this.darkTheme = storedDarkTheme === "true";
    }
  },
  mounted() {
    this.updateRole();
    this.updateSpaceUsage();
    eventBus.on("logout", () => {
      this.logOut();
    });

    this.isMobile = this.isMobileDevice();
    window.addEventListener("resize", this.handleWindowResize);
  },
  beforeUnmount() {
    eventBus.remove("logout");
    window.removeEventListener("resize", this.handleWindowResize);
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

<style>
.v-navigation-drawer__content {
  display: flex;
  flex-direction: column;
}
.fixed-top-right {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 99;
}
</style>
