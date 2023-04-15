<template>
  <div>
    <v-card :loading="loading" class="pa-2">
      <v-row class="d-flex justify-space-between pa-2">
        <v-col class="subtitle-1 font-weight-bold">My files</v-col>
        <v-col class="d-flex justify-end">
          <v-btn
            prepend-icon="fa fa-upload"
            variant="outlined"
            href="/files/upload"
            color="primary"
            dark
            >Upload file</v-btn
          >
        </v-col>
      </v-row>
      <v-autocomplete
        v-if="files.length !== 0"
        clearable
        v-model="selectedFile"
        label="Find a file"
        :loading="loading"
        :items="files"
        item-title="name"
        item-value="_id"
      >
        <template v-slot:append>
          <v-slide-x-reverse-transition mode="out-in">
            <v-icon
              color="primary"
              v-if="selectedFile"
              icon="fa fa-angles-right"
              @click="findFile"
            ></v-icon>
          </v-slide-x-reverse-transition>
        </template>
      </v-autocomplete>
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
                color="primary"
                @click="setCurrentFile(file)"
              >
                Show
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <file-preview-dialog
      v-if="dialog"
      :current-file="currentFile"
      @close="this.dialog = false"
    />
  </div>
</template>

<script>
import filesService from "../../services/files.service";
import FilePreviewDialog from "./FileDialog.vue";
import { useToast } from "vue-toastification";

export default {
  name: "MyFiles",
  components: {
    FilePreviewDialog,
  },
  data() {
    return {
      loading: true,
      files: [],
      dialog: false,
      currentFile: null,
      selectedFile: null,
      messages: [],
    };
  },
  async mounted() {
    this.$watch("messages", () => {
      const toast = useToast();
      if (this.messages) {
        if (Array.isArray(this.messages)) {
          this.messages.forEach((element) => {
            toast.error(element);
          });
        } else toast.error(this.messages);
      }
    });
    try {
      const res = await filesService.getMyFiles();
      this.files = res.data;
      this.updateSpaceUsage();
    } catch (err) {
      this.addErrors(err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async updateSpaceUsage() {
      await this.$store.dispatch("files/fetchStorageUsage");
    },
    convertSize(size) {
      return filesService.convertSize(size);
    },
    closeDialog() {
      this.dialog = false;
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
    getIcon(type) {
      switch (type) {
        case "text/plain":
          return "fa-regular fa-file";
        case "application/msword":
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          return "fa-regular fa-file-word";
        case "application/pdf":
          return "fa-regular fa-file-pdf";
        case "application/zip":
        case "application/x-rar-compressed":
        case "application/x-tar":
          return "fa-regular fa-file-zipper";
        case "image/jpeg":
        case "image/png":
        case "image/gif":
          return "fa-regular fa-file-image";
        case "audio/mpeg":
        case "audio/wav":
          return "fa-regular fa-ile-music";
        case "video/mp4":
        case "video/mpeg":
          return "fa-regular fa-file-video";
        default:
          return "fa-regular fa-file";
      }
    },
    setCurrentFile(file) {
      this.currentFile = file;
      this.dialog = true;
    },
    findFile() {
      const file = this.files.find((obj) => obj._id === this.selectedFile);
      this.setCurrentFile(file);
    },
  },
};
</script>
