<template>
  <v-card :loading="loading" class="pa-2">
    <v-row>
      <v-col>
        <v-progress-circular
          absolute
          bottom
          rounded
          height="3"
          size="200"
          width="30"
          color="teal"
          :indeterminate="loading"
        >
          20 %
        </v-progress-circular>
        <br />
        <br />
      </v-col>
      <v-col>
        <v-card>
          <v-btn
            color="cyan"
            prepend-icon="fa fa-refresh"
            @click="fetchStats"
            :loading="loading"
            >Refresh stats</v-btn
          >
        </v-card>
      </v-col>
    </v-row>
    <RouterView />
  </v-card>
</template>

<script>
import filesService from "../../services/files.service";
import shareCodeService from "../../services/shareCode.service";
import userService from "../../services/user.service";
import { useToast } from "vue-toastification";

export default {
  name: "AdminBoard",
  data() {
    return {
      dialog: false,
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
    this.fetchStats();
  },
  methods: {
    async fetchStats() {
      this.loading = true;
      this.loading = false;
    },
    async fetchUsers() {
      try {
      } catch (error) {
        this.addErrors(error);
      }
    },
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
  },
};
</script>
