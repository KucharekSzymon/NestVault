<template>
  <div>
    <v-card :loading="loading">
      <v-row class="d-flex justify-space-between align-center py-2">
        <v-col class="subtitle-1 font-weight-bold">My files</v-col>
        <v-col>
          <v-btn variant="outlined" href="/files/upload" color="primary" dark
            >Upload file</v-btn
          >
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="(file, index) in files"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card>
            <v-card-title>{{ file.name }}</v-card-title>
            <v-card-text>{{ convertSize(file.size) }}</v-card-text>
            <v-card-actions>
              <v-btn
                variant="outlined"
                :href="file.url"
                target="_blank"
                color="primary"
                >Download</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="js">
import filesService from "../../services/files.service";

export default {
  name: "AdminBoard",
  data() {
    return {
      loading: true,
      files: [],
    };
  },
  async mounted() {
    try {
      const res = await filesService.getMyFiles()
      this.files = res.data;
      this.updateSpaceUsage();
      this.loading = false;
    } catch (e) {
      console.log(e);
    }
  },
  methods: {
    async updateSpaceUsage() {
      await this.$store.dispatch("files/fetchStorageUsage");
    },
    convertSize(size) {
    return filesService.convertSize(size);
    },
  }
};
</script>
