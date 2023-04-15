<template>
  <div>
    <div>
      <form @submit.prevent="uploadFile">
        <div>
          <v-file-input v-model="file" label="Select a file"></v-file-input>
        </div>
        <div>
          <v-btn
            variant="outlined"
            :disabled="loading"
            :loading="loading"
            type="submit"
          >
            Upload
          </v-btn>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="js">
import filesService from "../../services/files.service";
import { useToast } from "vue-toastification";

export default {
  name: "UploadFile",

  data() {
    return {
      success: false,
      loading: false,
      messages: [],
      file: null,
    };
  },
  mounted() {
    this.$watch("messages", () => {
      const toast = useToast();
      if (this.messages) {
        if (Array.isArray(this.messages)) {
          this.messages.forEach((element) => {
            this.success ? toast.success(element) : toast.error(element);
          });
        } else this.success ? toast.success(this.messages) : toast.error(this.messages);
      }
    });
    this.updateSpaceUsage();
  },
  methods: {
    async uploadFile() {
      this.success = false;
      this.messages = [];

      if (!this.file) {
        this.messages = ["Select a file to upload."];
        return;
      }

      const formData = new FormData();
      this.loading = true;

      formData.append("file", this.file[0]);

      try {
        const response = await filesService.uploadFile(formData);
        this.updateSpaceUsage();
        this.success = true;
        this.messages = [response.data];
      } catch (error) {
        this.addErrors(error)
      }
      finally{this.loading = false}
    },
    addErrors(error){
      this.messages = (error.response &&
          error.response.data &&
          Array.isArray(error.response.data.message)
          ? error.response.data.message
          : [error.response.data.message]) || [error.message] || [
            error.toString(),
          ];
    },
    async updateSpaceUsage() {
      await this.$store.dispatch("files/fetchStorageUsage");
    },
  },
};
</script>
