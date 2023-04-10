<template>
  <div>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        fullscreen
        :scrim="false"
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark color="primary">
            <v-toolbar-title>
              {{ currentFile.name }} -
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
          <v-card v-else>
            <div>
              <div v-if="fileType === 'image'">
                <img
                  style="max-width: 100%"
                  :src="fileUrl"
                  alt="Image preview"
                />
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
      previewLoading: true,
      fileType: null,
      loadingFile: false,
    };
  },
  async mounted() {
    await this.fetchFilePreview(this.currentFile._id);
  },
  methods: {
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
    convertSize(size) {
      return filesService.convertSize(size)
    },
  },
};
</script>
