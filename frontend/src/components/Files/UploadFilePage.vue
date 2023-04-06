<template>
  <div>
    <div>
      <form @submit.prevent="uploadFile">
        <div>
          <v-file-input v-model="file" label="Select a file"></v-file-input>
        </div>
        <div>
          <v-btn :disabled="loading" :loading="loading" type="submit">
            Upload
          </v-btn>
        </div>

        <div v-if="messages" role="alert">
          <template v-if="Array.isArray(messages)">
            <v-alert
              :type="successful ? 'success' : 'error'"
              v-for="(message, index) in messages"
              :key="index"
            >
              {{ message }}
            </v-alert>
          </template>
          <template v-else>
            {{ messages }}
          </template>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import filesService from "../../services/files.service";

export default {
  name: "UploadFile",

  data() {
    return {
      successful: false,
      loading: false,
      messages: [],
      file: null,
    };
  },
  methods: {
    async uploadFile() {
      this.successful = false;

      if (!this.file) {
        this.messages = ["Select a file to upload."];
        return;
      }

      const formData = new FormData();
      this.loading = true;

      formData.append("file", this.file[0]);

      try {
        const response = await filesService.uploadFile(formData);
        this.loading = false;
        this.messages = [response.data];
        this.successful = true;
      } catch (error) {
        this.loading = false;
        this.messages = (error.response &&
        error.response.data &&
        Array.isArray(error.response.data.message)
          ? error.response.data.message
          : [error.response.data.message]) || [error.message] || [
            error.toString(),
          ];
      }
    },
  },
};
</script>
