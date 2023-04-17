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
        <v-col> Storage</v-col>
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
          <v-col>
            {{ convertSize(user.storedData) }} /
            {{ convertSize(user.storageLimit) }}</v-col
          >
          <v-divider vertical class="mx-4"></v-divider>
          <v-col>
            <v-btn-group>
              <v-btn color="primary" prepend-icon="fa fa-edit"> Edit </v-btn>
              <v-btn
                color="error"
                :loading="removing"
                icon="fa fa-trash"
                @click="(removeDialog = true), (selectedUser = user._id)"
              />
            </v-btn-group>
          </v-col>
        </v-row>
      </v-row>
    </v-card>
  </div>
  <v-dialog v-model="removeDialog" transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar>
        <v-toolbar-items>
          <v-btn
            icon="fa fa-xmark"
            size="large"
            @click="removeDialog = false"
          ></v-btn>
        </v-toolbar-items>
        <v-toolbar-title> Are you sure? </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-btn
        rounded="sm"
        color="error"
        prepend-icon="fa fa-trash"
        :loading="removing"
        @click="removeUser()"
        >Remove pernamently
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<script lang="js">
import filesService from "../../services/files.service";
import userService from "../../services/user.service";
import { useToast } from "vue-toastification";

export default {
  name: "UserList",

  data() {
    return {
      loading: false,
      removeDialog: false,
      users: [],
      selectedUser: null,
      messages: [],
      success: false,
      removing: false,

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
    async removeUser() {
      try {
        this.removing = true;
        await userService.removeUser(this.selectedUser);
        this.success = true;
        this.messages = ["User deleted"];
        this.fetchUsers();
      } catch (error) {
        this.success = false;
        this.addErrors(error);
      } finally {
        this.removing = false;
      }
    },

    convertSize(size) {
      return filesService.convertSize(size);
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
