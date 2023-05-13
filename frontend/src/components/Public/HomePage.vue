<template>
  <v-container class="front-page pa-10" fluid>
    <v-row>
      <!-- First Column -->
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="12">
            <h1 class="display-2">Welcome</h1>
          </v-col>
          <v-col cols="12">
            <p>
              Experience luxuries of <b>YOUR</b> minimal setup multi-platform
              file-server app. You can join this <b>{{ getAllUsers }}</b> users
              community that stopped worring about safety of their files. We
              stored <b>{{ getAllFiles }}</b> files already, that are taking a
              total of <b>{{ convertSize(getSpaceUsed) }}</b
              >.
            </p>
            <br />
            <p
              v-if="tipCategory != null && tip != null"
              class="text-medium-emphasis"
            >
              {{ tipCategory }} tip: {{ tip }}
            </p>
          </v-col>
        </v-row>
      </v-col>

      <!-- Second Column -->
      <v-col cols="12" md="6">
        <RouterView></RouterView>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import filesService from "../../services/files.service";
import { useToast } from "vue-toastification";

export default {
  name: "HomePage",
  data() {
    return {
      allFiles: null,
      allUsers: null,
      spaceUsed: null,
      success: false,
      loading: false,
      messages: [],
      tipCategory: null,
      tip: null,
    };
  },
  async mounted() {
    this.$watch("messages", () => {
      const toast = useToast();
      if (this.messages) {
        if (Array.isArray(this.messages)) {
          this.messages.forEach((element) => {
            this.success ? toast.success(element) : toast.error(element);
          });
        } else
          this.success
            ? toast.success(this.messages)
            : toast.error(this.messages);
      }
    });
    this.storeUpdate();
    await this.fetchTip();
  },
  computed: {
    getAllFiles() {
      return this.$store.state.publicStats.allFiles;
    },
    getAllUsers() {
      return this.$store.state.publicStats.allUsers;
    },
    getSpaceUsed() {
      return this.$store.state.publicStats.spaceUsed;
    },
  },
  methods: {
    addErrors(error) {
      this.success = false;
      this.messages = (error.response &&
      error.response.data &&
      Array.isArray(error.response.data.message)
        ? error.response.data.message
        : [error.response.data.message]) || [error.message] || [
          error.toString(),
        ];
    },
    convertSize(size) {
      return filesService.convertSize(size);
    },
    async storeUpdate() {
      this.loading = true;
      await this.$store.dispatch("publicStats/fetchStats");
      this.loading = false;
    },
    async fetchTip() {
      try {
        const res = await filesService.getTip();
        this.tipCategory = res.data.category;
        this.tip = res.data.tip;
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>
<style scoped></style>
