<template>
  <div>
    <v-card :loading="loading">
      <div>
        <h1>My Files</h1>
        <div></div>
        <div>
          <RouterLink to="newfile">
            <v-btn> </v-btn>
          </RouterLink>
        </div>
      </div>
      <!-- <v-row>
        <v-col
          v-if="files.length > 0"
          v-for="(file, index) in files"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card>
            <v-card-title>{{ file.name }}</v-card-title>
            <v-card-text>{{ file.description }}</v-card-text>
            <v-card-actions>
              <v-btn :href="file.url" target="_blank" color="primary"
                >Download</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row> -->
      {{ files }}
    </v-card>
  </div>
</template>

<script lang="js">
import filesService from "../services/files.service";

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
      console.log(res);
      this.files = res.data;
      this.loading = false;
    } catch (e) {
      console.log(e);
    }
  },
};
</script>
