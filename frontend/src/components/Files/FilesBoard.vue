<template>
  <div>
    <v-card :loading="loading" class="pa-2">
      <v-row class="d-flex justify-space-between">
        <v-col class="subtitle-1 font-weight-bold">Files</v-col>
      </v-row>
      <v-row>
        <v-col cols="4" md="2">
          <h4>Mine: {{ stats.mine }}</h4>
        </v-col>
        <v-col cols="4" md="2">
          Largest: {{ convertSize(stats.biggest) }}
        </v-col>
        <v-col cols="4" md="2">
          Smallest: {{ convertSize(stats.smallest) }}
        </v-col>
        <v-col cols="6" md="2"> Shared to me: {{ stats.sharedWithMe }} </v-col>
        <v-col cols="6" md="2"> Shared by me: {{ stats.shared }} </v-col>

        <v-col cols="12" md="2">
          <v-btn
            density="comfortable"
            append-icon="fa fa-refresh"
            @click="fetchStats"
            :loading="loading"
            >Refresh stats</v-btn
          >
        </v-col>
      </v-row>

      <Router-view />
    </v-card>
  </div>
</template>

<script>
import filesService from "../../services/files.service";
import { useToast } from "vue-toastification";

export default {
  name: "FilesBoard",
  data() {
    return {
      loading: false,
      stats: {},
      messages: [],
      success: false,
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
    this.fetchStats();
  },
  methods: {
    async fetchStats() {
      this.loading = true;
      try {
        const response = await filesService.getMyStats();
        this.stats = response.data;
      } catch (err) {
        this.addErrors(err);
      }
      this.loading = false;
    },
    convertSize(size) {
      return filesService.convertSize(size);
    },
    addErrors(error) {
      this.messages = (error.response &&
      error.response.data &&
      Array.isArray(error.response.data.message)
        ? error.response.data.message
        : [error.response.data.message]) || [error.message] || [
          error.toString(),
        ];
    },
  },
};
</script>
