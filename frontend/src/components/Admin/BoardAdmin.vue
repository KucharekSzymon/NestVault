<template>
  <v-card :loading="loading" class="pa-2">
    <v-row>
      <v-col>
        <span>All used space of all users</span>
        <br />
        <v-progress-circular
          v-model="allStoragePercentage"
          absolute
          bottom
          rounded
          height="3"
          size="300"
          width="35"
          color="teal"
          :indeterminate="loading"
        >
          {{ allStoragePercentage }} %
        </v-progress-circular>
        <br />
        <br />
        Stored {{ convertSize(spaceUsed) }} from
        {{ convertSize(spaceLimit) }} Limit
      </v-col>
      <v-col>
        <h3>
          App have now
          <span class="text-green">{{ data.allUsers }}</span> registered users,
          <span class="text-red">{{ data.admins }}</span> administrators
        </h3>
        <p>Users stored {{ data.allFiles }} files</p>
        <p>
          Biggest stored file is
          <strong>{{ convertSize(data.biggestFile) }}</strong>
        </p>
        <p>
          Smallest stored file is
          <i>{{ convertSize(data.smallestFile) }}</i>
        </p>
        <p>
          Biggest hoarder is <strong>{{ data.hoarder }}</strong> stored
          <strong>{{ convertSize(data.mostStored) }}</strong>
        </p>
        <v-btn
          color="cyan"
          prepend-icon="fa fa-refresh"
          @click="fetchStats"
          :loading="loading"
          >Refresh stats</v-btn
        >
      </v-col>
    </v-row>
    <RouterView />
  </v-card>
</template>

<script>
import filesService from "../../services/files.service";
import { useToast } from "vue-toastification";

export default {
  name: "AdminBoard",
  data() {
    return {
      dialog: false,
      success: false,
      loading: false,
      spaceUsed: 0,
      spaceLimit: 0,
      data: {},
      messages: [],
    };
  },
  computed: {
    allStoragePercentage() {
      return (this.data.spaceUsed / this.data.spaceLimit) * 100;
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
    this.fetchStats();
  },
  methods: {
    async fetchStats() {
      this.loading = true;
      try {
        const response = await filesService.getAdminStats();
        this.success = true;
        this.data = response.data;
        this.spaceUsed = this.data.spaceUsed;
        this.spaceLimit = this.data.spaceLimit;
      } catch (error) {
        this.addErrors(error);
      } finally {
        this.loading = false;
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
