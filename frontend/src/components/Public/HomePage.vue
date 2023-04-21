<template>
  <v-row>
    <v-col class="flex-column">
      <p>All users : {{ getAllUsers }}</p>
      <p>All files : {{ getAllFiles }}</p>
      <p>Space used : {{ convertSize(getSpaceUsed) }}</p>
    </v-col>
    <v-col class="d-flex justify-end">
      <RouterView />
    </v-col>
  </v-row>
</template>

<script>
import filesService from "../../services/files.service";
import { useToast } from "vue-toastification";

export default {
  name: "HomePage",
  data() {
    return {
      allFiles: null,
      allUsers: null,
      spaceUsed: null,
      success: false,
      loading: false,
      messages: [],
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
        } else
          this.success
            ? toast.success(this.messages)
            : toast.error(this.messages);
      }
    });
    this.storeUpdate();
  },
  computed: {
    getAllFiles() {
      return this.$store.state.publicStats.allFiles;
    },
    getAllUsers() {
      return this.$store.state.publicStats.allUsers;
    },
    getSpaceUsed() {
      return this.$store.state.publicStats.spaceUsed;
    },
  },
  methods: {
    addErrors(error) {
      this.success = false;
      this.messages = (error.response &&
      error.response.data &&
      Array.isArray(error.response.data.message)
        ? error.response.data.message
        : [error.response.data.message]) || [error.message] || [
          error.toString(),
        ];
    },
    convertSize(size) {
      return filesService.convertSize(size);
    },
    async storeUpdate() {
      this.loading = true;
      await this.$store.dispatch("publicStats/fetchStats");
      this.loading = false;
    },
  },
};
</script>
