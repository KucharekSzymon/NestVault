<template>
  <v-card :loading="loading" class="pa-2">
    <pre>
    {{ user }}
  </pre
    >
  </v-card>
</template>

<script>
import userService from "../../services/user.service";
import { useToast } from "vue-toastification";

export default {
  name: "UserBoard",
  data() {
    return {
      success: false,
      loading: false,
      messages: [],
      user: null,
    };
  },
  async mounted() {
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
    await this.getMyData();
  },
  methods: {
    async getMyData() {
      try {
        this.loading = true;
        const response = await userService.getMyData();
        this.success = true;
        this.user = response.data;
      } catch (error) {
        this.success = false;
        this.addErrors(error);
      } finally {
        this.loading = false;
      }
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
  },
};
</script>
