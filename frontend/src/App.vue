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
        <router-link class="text-decoration-none" to="/profile">
          <v-list-item
            prepend-icon="fa fa-user"
            :title="currentUser.name"
            :subtitle="currentUser.email"
            value=""
          ></v-list-item>
        </router-link>
        <v-divider />
        <v-list-item
          prepend-icon="fa:fas fa-folder"
          title="My Files"
          value="myfiles"
        ></v-list-item>

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

        <router-link v-if="isAdmin" class="text-decoration-none" to="/admin">
          <v-list-item
            prepend-icon="fa-solid fa-screwdriver-wrench"
            title="Admin board"
            value="admin"
          />
        </router-link>
        <router-link class="text-decoration-none" to="/user">
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
        <v-list-item>
          <v-progress-circular
            v-model="dataProgress"
            class="me-2"
          ></v-progress-circular>
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
import UserService from "./services/user.service";
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
    dataUsed() {
      return UserService.getSpaceUsed();
    },
    dataProgress() {
      // console.log(this.dataMaxLimit);
      return (this.dataUsed / this.dataMaxLimit) * 100;
    },
    dataMaxLimit() {
      return UserService.getSpaceLeft();
    },
  },
  methods: {
    async checkAdminRole() {
      console.log("Role check");
      if (this.currentUser)
        try {
          this.isAdmin = await AuthService.checkRole();
        } catch (error) {
          console.log(error);
        }
    },
    logOut() {
      this.$store.dispatch("auth/logout");
      this.isAdmin = false;
      this.$router.push("/login");
    },
  },
  async mounted() {
    try {
      this.checkAdminRole;
    } catch (error) {
      console.log(error);
    }
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
      } else {
        this.isAdmin = false;
      }
    },
  },
};
</script>
