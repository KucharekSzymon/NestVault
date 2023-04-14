<template>
  <div>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        fullscreen
        persistent
        :scrim="false"
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark color="primary">
            <v-toolbar-items>
              <v-btn
                icon="fa fa-xmark"
                size="large"
                @click="closeDialog"
              ></v-btn>
            </v-toolbar-items>
            <v-toolbar-title>
              {{ currentFile.name }} -
              <span>{{ convertSize(currentFile.size) }}</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn
                icon="fa fa-floppy-disk"
                size="large"
                :download="currentFile.name"
                target="_blank"
                :href="downloadLink"
                :loading="downloadLink == null"
              ></v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-divider></v-divider>
          <v-card v-if="fileUrl == null">
            <v-progress-circular
              color="primary"
              indeterminate
              size="64"
            ></v-progress-circular>
            <span>Loading preview</span>
          </v-card>
          <v-card v-else>
            <div>
              <div v-if="fileType === 'image'">
                <img class="previewFile" :src="fileUrl" alt="Image preview" />
              </div>
              <div v-else-if="fileType === 'video'">
                <video class="previewFile" :src="fileUrl" controls></video>
              </div>
              <!-- <div v-else-if="fileType === 'pdf'">
                  <iframe :src="fileUrl" frameborder="0"></iframe>
                </div> -->
              <div v-else-if="fileType === 'audio'">
                <audio class="previewFile" :src="fileUrl" controls></audio>
              </div>
              <div v-else>Unsupported file type</div>
            </div>
          </v-card>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script lang="js">
import filesService from "../../services/files.service";

export default {
  name: "FilePreviewDialog",
  props: ['currentFile'],
  data() {
    return {
      dialog: true,
      fileUrl: null,
      fileType: null,
      downloadLink: null,
    };
  },
  async mounted() {
    await this.fetchFilePreview()
    await this.fetchDownload()
  },
  methods: {
    async fetchFilePreview() {
      this.fileType = this.getFileType(this.currentFile.type);;
      if (this.fileType != null) {
        const response = await filesService.previewFile(this.currentFile._id)
        this.fileUrl = URL.createObjectURL(response.data);
      }
    },
    async fetchDownload() {
      try {
        const response = await filesService.downloadFile(this.currentFile._id)
        const link = window.URL.createObjectURL(new Blob([response.data]));
        this.downloadLink = link
      } catch (error) {
        console.log(error);
      }
    },

    async updateSpaceUsage() {
      await this.$store.dispatch("files/fetchStorageUsage");
    },
    closeDialog() {
      this.$emit('close');
    },
    getFileType(type) {
      const partType = type.split('/')[0];
      if (partType == 'image') {
        return 'image';
      } else if (partType == 'video') {
        return 'video';
      } else if (partType == 'audio') {
        return 'audio'
      } else if (type == 'application/pdf') {
        return 'pdf';
      } else {
        return null;
      }
    },
    convertSize(size) {
      return filesService.convertSize(size)
    },
  },
};
</script>

<style>
.previewFile {
  max-width: 100%;
  max-height: 90vh;
}
</style>
