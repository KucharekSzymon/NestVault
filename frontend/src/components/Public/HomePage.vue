<template>
  <v-card :loading="loading" class="pa-2">
    <v-row>
      <v-col class="subtitle-1 font-weight-bold">User panel</v-col>
    </v-row>
    <v-row>
      <v-col>
        <span> Space used : {{ convertSize(allSpaceUsed) }} </span>
      </v-col>
      <v-col> </v-col>
    </v-row>
    <RouterView />
  </v-card>
</template>

<script>
import filesService from "../../services/files.service";
import { useToast } from "vue-toastification";

export default {
  name: "HomePage",
  data() {
    return {
      success: false,
      loading: false,
      messages: [],
    };
  },
  computed: {
    allFiles() {
      return this.$store.state.public.allFiles;
    },
    allUsers() {
      return this.$store.state.public.allUsers;
    },
    allSpaceUsed() {
      return this.$store.state.public.spaceUsed;
    },
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
