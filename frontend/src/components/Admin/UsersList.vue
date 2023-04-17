<template>
  <div>
    <v-card :loading="loading" class="pa-2">
      <v-row class="d-flex justify-space-between pa-2">
        <v-col class="subtitle-1 font-weight-bold">Users</v-col>
        <v-btn
          class="ma-5"
          :loading="loading"
          @click="fetchUsers"
          icon="fa fa-refresh"
        />
      </v-row>
      <v-row>
        <v-autocomplete
          v-if="users.length !== 0"
          clearable
          v-model="selectedSearch"
          label="Find user"
          :loading="loading"
          :items="users"
          item-title="combo"
          item-value="_id"
        >
          <template v-slot:append>
            <v-slide-x-reverse-transition mode="out-in">
              <v-icon
                color="primary"
                :loading="loading"
                icon="fa fa-angles-right"
              ></v-icon>
            </v-slide-x-reverse-transition>
          </template>
        </v-autocomplete>
      </v-row>
      <v-row>
        <v-col>Role</v-col>
        <v-col> Id </v-col>
        <v-col> Name </v-col>
        <v-col> Email</v-col>
        <v-col> Action </v-col>
      </v-row>

      <v-row cols="12" v-for="(user, index) in users" :key="index" class="pa-2">
        <v-row>
          <v-col>
            <v-icon
              :icon="user.isAdmin ? 'fa fa-user-shield' : 'fa fa-user'"
              :color="user.isAdmin ? 'indigo' : 'green'"
            />
          </v-col>
          <v-col>
            {{ user._id }}
          </v-col>
          <v-col>
            {{ user.name }}
          </v-col>
          <v-col>
            {{ user.email }}
          </v-col>
          <v-divider vertical class="mx-4"></v-divider>
          <v-col>
            <v-btn-group>
              <v-btn
                :loading="removing"
                :prepend-icon="
                  user.isAdmin
                    ? 'fa-solid fa-arrow-trend-down'
                    : 'fa-solid fa-arrow-trend-up'
                "
                :color="user.isAdmin ? 'warning' : 'success'"
                >Role
              </v-btn>
              <v-btn
                color="primary"
                :loading="removing"
                prepend-icon="fa fa-edit"
              >
                Edit
              </v-btn>
              <v-btn color="error" :loading="removing" icon="fa fa-trash" />
            </v-btn-group>
          </v-col>
        </v-row>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="js">
import userService from "../../services/user.service";
import { useToast } from "vue-toastification";

export default {
  name: "UserList",

  data() {
    return {
      loading: false,
      users: [],
      messages: [],
      success: false,
      removing: false,
      selectedSearch: null,
      selectedCode: null,
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
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        this.loading = true;
        const res = await userService.getAllUsersAdmin();
        this.users = res.data;
      } catch (err) {
        this.addErrors(err)
      } finally {
        this.loading = false;
      }
    },
    async removeCode(codeId) {
      this.removing = true;
      try {
        const response = await userService.remove(codeId);
        this.success = true;
        this.messages = [response.data.message];
        await this.fetchCodes();
      } catch (error) {
        this.success = false;
        this.addErrors(error);
      } finally {
        this.removing = false;
      }
    },
    copyCode(code) {
      navigator.clipboard.writeText(code);
      this.success = true;
      this.messages = ["Code copied to clipboard"];
    },
    findCode(selectedSearch) {
      const index = this.users.findIndex((code) => code._id === selectedSearch);
      if (index !== -1) {
        this.selectedCode = index;
      }
    },
    checkDate(date) {
      const now = new Date();
      const expireTime = new Date(date);
      console.log(date);
      return expireTime > now ? "fa fa-active" : "fa fa-error";
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
