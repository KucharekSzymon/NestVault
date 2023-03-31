<template>
  <v-app id="inspire">
    <!-- <v-system-bar>
      <v-spacer></v-spacer>

      <v-icon>mdi-square</v-icon>

      <v-icon>mdi-circle</v-icon>

      <v-icon>mdi-triangle</v-icon>
      <v-icon icon="fas fa-plus" />
      <v-icon icon="mdi:mdi-minus" />
    </v-system-bar> -->
    <v-navigation-drawer v-model="drawer" expand-on-hover rail>
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
          title="Sandra Adams"
          subtitle="sandra_a88@gmailcom"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          class="rounded-shaped"
          prepend-icon="fa:fas fa-folder"
          title="My Files"
          value="myfiles"
        ></v-list-item>
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
      <v-btn class="" @click="toggleTheme">
        <v-icon icon="fas fa-circle-half-stroke" />
      </v-btn>
    </v-navigation-drawer>

    <v-main>
      <v-container class="py-8 px-6" fluid
        ><v-card>
          <v-autocomplete
            clearable
            chips
            label="Autocomplete"
            :items="[
              'California',
              'Colorado',
              'Florida',
              'Georgia',
              'Texas',
              'Wyoming',
            ]"
            multiple
          ></v-autocomplete>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { useTheme } from "vuetify";

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
    dataUsed() {
      return 2;
    },
    dataProgress() {
      return (this.dataUsed / this.dataMaxLimit) * 100;
    },
    dataMaxLimit() {
      return 10;
    },
  },
};
</script>
