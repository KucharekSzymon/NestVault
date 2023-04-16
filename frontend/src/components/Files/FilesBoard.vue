<template>
  <div>
    <v-card :loading="loading" class="pa-2">
      <v-row class="d-flex justify-space-between">
        <v-col class="subtitle-1 font-weight-bold">Files</v-col>
      </v-row>
      <v-row>
        <v-col cols="4" md="2">
          <h3>Mine: {{ files.length }}</h3>
        </v-col>
        <v-col cols="4" md="2"> Largest: {{ convertSize(biggestFile) }}</v-col>
        <v-col cols="4" md="2">
          Smallest: {{ convertSize(smallestFile) }}</v-col
        >
        <v-col cols="6" md="2">
          <h4>Shared to me: {{ shared.length }}</h4>
        </v-col>
        <v-col cols="6" md="2">
          <h4>Shared by me: {{ iShare.length }}</h4>
        </v-col>

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
      files: [],
      shared: [],
      iShare: [],
      messages: [],
      success: false,
      smallestFile: 0,
      biggestFile: 0,
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
      await this.fetchMyFiles();
      await this.fetchShared();
      await this.fetchIShare();
      this.setBiggest();
      this.setSmallest();
      this.loading = false;
    },
    setSmallest() {
      this.smallestFile = Math.min(...this.files.map((file) => file.size));
    },
    setBiggest() {
      this.biggestFile = Math.max(...this.files.map((file) => file.size));
    },
    async fetchMyFiles() {
      try {
        const res = await filesService.getMyFiles();
        this.files = res.data;
      } catch (err) {
        this.addErrors(err);
      }
    },
    async fetchShared() {
      try {
        const res = await filesService.getSharedWithMe();
        this.shared = res.data;
      } catch (err) {
        this.addErrors(err);
      }
    },
    async fetchIShare() {
      try {
        const res = await filesService.getSharedByMe();
        this.iShare = res.data;
      } catch (err) {
        this.addErrors(err);
      }
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
