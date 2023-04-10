<template>
  <div>
    <v-card :loading="loading">
      <v-row class="d-flex justify-space-between align-center pa-2">
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
          <v-card
            class="pa-5 h-100 d-flex flex-column justify-center align-center"
            variant="tonal"
          >
            <v-icon size="x-large" :icon="getIcon(file.type)"></v-icon>
            <v-card-title style="white-space: pre-line" class="text-center">{{
              file.name
            }}</v-card-title>
            <v-card-text class="text-center">{{
              convertSize(file.size)
            }}</v-card-text>
            <v-card-actions class="text-center">
              <v-btn
                variant="outlined"
                :href="file.url"
                target="_blank"
                color="primary"
                @click="setCurrentFile(file)"
                >Show</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>

  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title
            >{{ currentFile.name }} -
            <span>{{ convertSize(currentFile.size) }}</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              icon="fa fa-xmark"
              size="large"
              @click="dialog = false"
            ></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card v-if="previewLoading">
          <v-progress-circular
            color="primary"
            indeterminate
            size="64"
          ></v-progress-circular>
          <span>Loading preview</span>
        </v-card>
        <v-card v-if="!previewLoading">
          <div>
            <div v-if="fileType === 'image'">
              <img style="max-width: 100%" :src="fileUrl" alt="Image preview" />
            </div>
            <div v-else-if="fileType === 'video'">
              <video style="max-width: 100%" :src="fileUrl" controls></video>
            </div>
            <!-- <div v-else-if="fileType === 'pdf'">
            <iframe :src="fileUrl" frameborder="0"></iframe>
          </div> -->
            <div v-else-if="fileType === 'audio'">
              <audio style="max-width: 100%" :src="fileUrl" controls></audio>
            </div>
            <div v-else>Unsupported file type</div>
          </div>
        </v-card>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="js">
import filesService from "../../services/files.service";

export default {
  name: "AdminBoard",
  data() {
    return {
      loading: true,
      files: [],
      dialog: false,
      currentFile: null,
      fileUrl: null,
      fileType: null,
      loadingFile: false,
      previewLoading: true,
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
    async fetchFilePreview(fileId){
      this.previewLoading = true;
      const response = await filesService.previewFile(fileId)
      const file = response.data;
      const fileUrl = URL.createObjectURL(file);
      const fileType = this.getFileType(this.currentFile.type);
      this.fileUrl = fileUrl;
      this.fileType = fileType;
      this.previewLoading = false;
    },
    setCurrentFile(file){
      this.currentFile = file;
      this.dialog = true;
      this.fetchFilePreview(file._id)
    },
    convertSize(size) {
    return filesService.convertSize(size);
    },
    getFileType(type) {
      const partType =  type.split('/')[0];
      if (partType == 'image') {
        return 'image';
      } else if (partType == 'video') {
        return 'video';}
      else if (partType == 'audio'){
          return 'audio'
      }else if (type == 'application/pdf') {
        return 'pdf';
      } else {
        return null;
      }
    },
    getIcon(type){
      switch (type) {
        case 'text/plain':
          return 'fa-regular fa-file';
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          return 'fa-regular fa-file-word';
        case 'application/pdf':
          return 'fa-regular fa-file-pdf';
        case 'application/zip':
        case 'application/x-rar-compressed':
        case 'application/x-tar':
          return 'fa-regular fa-file-zipper';
        case 'image/jpeg':
        case 'image/png':
        case 'image/gif':
          return 'fa-regular fa-file-image';
        case 'audio/mpeg':
        case 'audio/wav':
          return 'fa-regular fa-ile-music';
        case 'video/mp4':
        case 'video/mpeg':
          return 'fa-regular fa-file-video';
        default:
        return 'fa-regular fa-file';
      }
    },
    beforeUnmount() {
    URL.revokeObjectURL(this.fileUrl);
  },
  }
};
</script>

<style>
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}
</style>
