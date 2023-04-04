<template>
  <v-app id="app">
    <v-navigation-drawer v-model="drawer" expand-on-hover rail>
      <v-list v-if="currentUser">
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
          :title="currentUser.name"
          :subtitle="currentUser.email"
        ></v-list-item>
      </v-list>

      <v-list v-if="!currentUser" density="compact" nav>
        <router-link class="text-decoration-none" to="/login">
          <v-list-item
            prepend-icon="fa-regular fa-star"
            title="Sign in"
            value="Sign in"
          />
        </router-link>
        <router-link class="text-decoration-none" to="/register">
          <v-list-item
            prepend-icon="fa-solid fa-star"
            title="Sign Up"
            value="Sign Up"
          />
        </router-link>
      </v-list>

      <v-list density="compact" nav>
        <v-list-item
          class="rounded-shaped"
          prepend-icon="fa:fas fa-folder"
          title="My Files"
          value="myfiles"
        ></v-list-item>
        <v-list-item> </v-list-item>

        <v-list-item
          class="rounded-shaped"
          prepend-icon="fas fa-share"
          title="Shared with me"
          value="shared"
        ></v-list-item>
        <v-list-item
          class="rounded-shaped"
          prepend-icon="fas fa-star"
          title="Starred"
          value="starred"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          class="rounded-shaped"
          v-for="[icon, text] in links"
          :key="icon"
          link
        >
          <template v-slot:prepend>
            <v-icon>{{ icon }}</v-icon>
          </template>

          <v-list-item-title>{{ text }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-progress-circular
        v-model="dataProgress"
        class="me-2"
      ></v-progress-circular>

      <v-btn
        density="default"
        icon="fa fa-circle-half-stroke"
        @click="toggleTheme"
      >
      </v-btn>

      <router-link to="/home"> Home </router-link>
      <router-link to="/" v-if="showAdminBoard">Admin Board</router-link>

      <router-link v-if="currentUser" to="/user">User</router-link>

      <div v-if="currentUser" class="flex md:order-2 gap-2">
        <router-link to="/profile">
          <div>
            {{ currentUser.name }}
          </div>
        </router-link>
        <a @click.prevent="logOut">
          <button>LogOut</button>
        </a>
      </div>
    </v-navigation-drawer>

    <v-main>
      <v-container class="py-8 px-6">
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
import UsersService from "./services/user.service";

export default {
  data: () => ({
    cards: ["Today", "Yesterday"],
    drawer: null,
    links: [
      ["mdi:mdi-inbox-arrow-down", "Inbox"],
      ["mdi:mdi-send", "Send"],
      ["mdi:mdi-delete", "Trash"],
      ["mdi:mdi-alert-octagon", "Spam"],
    ],
  }),
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
    showAdminBoard() {
      if (this.currentUser && this.currentUser.admin) {
        return this.currentUser.admin;
      }

      return false;
    },
    dataUsed() {
      return UsersService.getSpaceUsed();
    },
    dataProgress() {
      console.log(this.dataMaxLimit);
      return (this.dataUsed / this.dataMaxLimit) * 100;
    },
    dataMaxLimit() {
      return UsersService.getSpaceLeft();
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
    },
  },
  mounted() {
    eventBus.on("logout", () => {
      this.logOut();
    });
  },
  beforeUnmount() {
    eventBus.remove("logout");
  },
};
</script>
