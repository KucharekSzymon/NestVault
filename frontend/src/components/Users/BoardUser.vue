<template>
  <v-card :loading="loading" class="pa-2">
    <v-row v-if="user">
      <v-col>
        <v-progress-circular
          v-model="dataUsagePercentage"
          absolute
          bottom
          rounded
          height="3"
          size="200"
          width="30"
          color="teal"
          :intermidate="storageLoading"
          v-if="user"
        >
          {{ dataUsagePercentage }} %
        </v-progress-circular>
        <br />
        <br />

        <span v-if="user">
          Space used : {{ convertSize(user.storedData) }} /
          {{ convertSize(user.storageLimit) }}
        </span>
      </v-col>
      <v-col>
        <v-card>
          <h1>
            {{ user.name }}
          </h1>
          <h2>
            {{ user.email }}
          </h2>
          <h3>Role: {{ user.isAdmin ? "Administrator" : "User" }}</h3>
          <v-btn-group>
            <v-btn
              color="primary"
              prepend-icon="fa-solid fa-pen-to-square"
              @click="dialog = true"
              >Change data</v-btn
            >
            <v-btn
              color="error"
              prepend-icon="fa-solid fa-user-slash"
              @click="removeDialog = true"
              >Delete user</v-btn
            >
          </v-btn-group>
        </v-card>
      </v-col>
    </v-row>
    <RouterView />
  </v-card>
  <v-dialog v-model="dialog">
    <v-card>
      <v-toolbar>
        <v-toolbar-items>
          <v-btn
            icon="fa fa-xmark"
            size="large"
            @click="dialog = false"
          ></v-btn>
        </v-toolbar-items>
        <v-toolbar-title> Edit user data </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="fName" label="First name*" required>
                <template v-slot:prepend>
                  <v-icon icon="fa fa-user"></v-icon>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                label="Last name*"
                v-model="scdName"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Password*"
                v-model="password"
                type="password"
                required
              >
                <template v-slot:prepend>
                  <v-icon icon="fa fa-key"></v-icon>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          prepend-icon="fa-regular fa-circle-xmark"
          @click="dialog = false"
        >
          Close
        </v-btn>
        <v-btn
          prepend-icon="fa fa-pen-clip"
          color="blue-darken-1"
          variant="text"
          :loading="updating"
          @click="updateData"
        >
          Update
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
        @click="removeUser"
        :loading="removalLoading"
        >Remove pernamently
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
import filesService from "../../services/files.service";
import userService from "../../services/user.service";
import { useToast } from "vue-toastification";

export default {
  name: "UserDashboard",
  data() {
    return {
      dialog: false,
      removeDialog: false,
      success: false,
      loading: false,
      messages: [],
      user: null,
      storageLoading: false,
      updating: false,
      fName: null,
      scdName: null,
      password: null,
      removalLoading: false,
    };
  },
  computed: {
    dataUsagePercentage() {
      return this.$store.state.files.spaceLeft.toFixed(3);
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
    this.getMyData();
    this.updateSpaceUsage();
  },
  methods: {
    async getMyData() {
      try {
        this.loading = true;
        const response = await userService.getMyData();
        this.success = true;
        this.user = response.data;
        this.fName = response.data.name.split(" ")[0];
        this.scdName = response.data.name.split(" ")[1];
      } catch (error) {
        this.success = false;
        this.addErrors(error);
      } finally {
        this.loading = false;
      }
    },
    async updateData() {
      try {
        this.updating = true;
        const data = {
          name: this.fName + " " + this.scdName,
          password: this.password,
        };
        await userService.updateUserData(data, this.user._id);
        this.success = true;
        this.messages = ["Data updated successfully"];
        this.dialog = false;
        this.getMyData();
      } catch (error) {
        this.addErrors(error);
      } finally {
        this.updating = false;
      }
    },
    async removeUser() {
      try {
        this.removalLoading = true;
        await userService.removeUser(this.user._id);
        this.success = true;
        this.messages = ["User deleted"];
        this.deleted();
      } catch (error) {
        this.success = false;
        this.addErrors(error);
      } finally {
        this.removalLoading = false;
      }
    },
    async updateSpaceUsage() {
      this.storageLoading = true;
      if (this.currentUser)
        await this.$store.dispatch("files/fetchStorageUsage");
      this.storageLoading = false;
    },
    deleted() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
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
