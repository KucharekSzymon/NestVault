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
              <v-btn-group>
                <v-btn
                  size="large"
                  color="info"
                  prepend-icon="fa fa-share"
                  @click="(nestedDialog = true), (nestedDialogTitle = 'Share')"
                >
                  Share
                </v-btn>
                <v-btn
                  size="large"
                  color="success"
                  prepend-icon="fa fa-floppy-disk"
                  :loading="downloadBtnLoading"
                  :href="downloadLink"
                  target="_blank"
                  :download="currentFile.name"
                >
                  Download
                </v-btn>
                <v-btn
                  size="large"
                  color="error"
                  icon="fa fa-trash"
                  @click="
                    (nestedDialog = true),
                      (nestedDialogTitle = 'Remove file pernamently')
                  "
                />
              </v-btn-group>
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
          <v-dialog
            v-model="nestedDialog"
            max-width="50vw"
            transition="dialog-bottom-transition"
          >
            <v-card>
              <v-card-title> {{ nestedDialogTitle }} </v-card-title>
              <v-card-actions>
                <v-btn @click="nestedDialog = false">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
      nestedDialog: false,
      nestedDialogTitle: "",
      downloadLink: null,
      downloadBtnLoading: false,
    };
  },
  async mounted() {
    this.previewLoading = true;
    this.downloadBtnLoading = true;

    await this.fetchFilePreview(this.currentFile._id);
    await this.fetchDownload(this.currentFile._id)
  },
  methods: {
    async fetchFilePreview(fileId) {
      const response = await filesService.previewFile(fileId)
      this.fileUrl = URL.createObjectURL(response.data);;
      this.fileType = this.getFileType(this.currentFile.type);;
      this.previewLoading = false;
    },
    async fetchDownload(fileId) {
      const response = await filesService.downloadFile(fileId)
      const link  =window.URL.createObjectURL(new Blob([response.data]));
      //link.setAttribute('download', 'file.txt'); // replace with your file name
      this.downloadLink = link
      this.downloadBtnLoading = false;
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
