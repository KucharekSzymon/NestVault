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
        <v-col> Role</v-col>
        <!-- <v-col> Id </v-col> -->
        <v-col> Name </v-col>
        <v-col> Email</v-col>
        <v-col> Storage</v-col>
        <v-col> Action </v-col>
      </v-row>

      <v-row cols="12" v-for="(user, index) in users" :key="index">
        <v-col>
          <v-icon
            :icon="user.isAdmin ? 'fa fa-user-shield' : 'fa fa-user'"
            :color="user.isAdmin ? 'indigo' : 'green'"
          />
        </v-col>
        <!-- <v-col>
          {{ user._id }}
        </v-col> -->
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
        <v-col>
          <v-btn-group>
            <v-btn
              :loading="roleChange"
              :color="user.isAdmin ? 'success' : 'info'"
              :prepend-icon="
                user.isAdmin ? 'fa fa-arrow-down' : 'fa fa-arrow-up'
              "
              @click="(selectedUser = user), changeRole(false)"
            >
              Role
            </v-btn>
            <v-btn
              color="primary"
              prepend-icon="fa fa-edit"
              @click="(dialog = true), (selectedUser = user)"
            >
              Edit
            </v-btn>
            <v-btn
              color="error"
              :loading="removing"
              icon="fa fa-trash"
              @click="(removeDialog = true), (selectedUser = user)"
            />
          </v-btn-group>
        </v-col>
      </v-row>
    </v-card>
  </div>
  <v-dialog v-model="dialog">
    <v-card>
      <v-toolbar>
        <v-toolbar-items>
          <v-btn icon="fa fa-xmark" size="large" @click="dialog = false" />
        </v-toolbar-items>
        <v-toolbar-title> Edit user data </v-toolbar-title>

        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            class="d-flex"
            icon="fa fa-trash"
            color="red"
            size="large"
            @click="removeDialog = true"
          />
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field v-model="selectedUser.name" label="Name*" required>
                <template v-slot:prepend>
                  <v-icon icon="fa fa-user"></v-icon>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" md="4">
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
            <v-col cols="12" md="4">
              <v-btn
                prepend-icon="fa fa-pen-clip"
                size="x-large"
                color="blue-darken-1"
                :loading="updating"
                @click="updateData"
              >
                Details
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-slider
                  v-model="selectedUser.storageLimit"
                  :min="selectedUser.storedData"
                  :max="50 * 1024 * 1024 * 1024"
                  :step="1024 * 1024 * 512"
                  label="Storage limit"
                >
                  <template v-slot:prepend>
                    <v-btn
                      icon="fa fa-minus"
                      density="compact"
                      variant="outlined"
                      @click="selectedUser.storageLimit -= 1024 * 1024 * 256"
                    />
                    <v-btn
                      icon="fa fa-minus"
                      density="comfortable"
                      variant="outlined"
                      @click="selectedUser.storageLimit -= 1024 * 1024 * 1024"
                    />
                  </template>
                  <template v-slot:append>
                    <v-btn
                      icon="fa fa-plus"
                      density="comfortable"
                      variant="outlined"
                      @click="selectedUser.storageLimit += 1024 * 1024 * 1024"
                    />
                    <v-btn
                      icon="fa fa-plus"
                      density="compact"
                      variant="outlined"
                      @click="selectedUser.storageLimit += 1024 * 1024 * 256"
                    />
                  </template>
                </v-slider>
              </v-row>
              <v-row>
                <v-col cols="8" md="8">
                  <v-text-field
                    v-model="selectedUser.storageLimit"
                    type="number"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="4" md="2">
                  <v-text-field
                    :value="convertSize(selectedUser.storageLimit)"
                    disabled
                  />
                </v-col>
                <v-col cols="12" md="2">
                  <v-btn
                    prepend-icon="fa fa-pen-clip"
                    size="x-large"
                    color="blue-darken-1"
                    :loading="updating"
                    @click="updateStorage"
                  >
                    Storage
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-switch
                v-model="selectedUser.isAdmin"
                inset
                :loading="roleChange ? 'warning' : false"
                color="info"
                label="Admin role"
                @click="changeRole(true)"
              ></v-switch>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="removeDialog">
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
      dialog: false,
      loading: false,
      removeDialog: false,
      users: [],
      selectedUser: null,
      messages: [],
      success: false,
      removing: false,
      password: null,
      updating: false,
      roleChange: false

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
    async updateData() {
      try {
        this.updating = true;
        const data = {
          name: this.selectedUser.name,
          password: this.password,
        };
        await userService.updateUserData(data, this.selectedUser._id);
        this.storeUpdate()
        this.success = true;
        this.messages = ["Data updated successfully"];
        this.fetchUsers();
      } catch (error) {
        this.addErrors(error);
      }
      finally{this.updating = false}
    },
    async updateStorage() {
      try {
        this.updating = true;
        const data = {
          userId: this.selectedUser._id,
          newStorageLimit: this.selectedUser.storageLimit,
        };
        await userService.updateStorageLimit(data);
        this.storeUpdate()
        this.success = true;
        this.messages = ["Storage limit updated successfully"];
        this.fetchUsers();
      } catch (error) {
        this.addErrors(error);
      }
      finally{this.updating = false}
    },
    async changeRole(isSwitch){
       this.roleChange = true
       try {
        let response = []
        if(this.selectedUser.isAdmin){
         response = await userService.demote(this.selectedUser._id)}
        else{
         response = await userService.promote(this.selectedUser._id)}
         this.storeUpdate()
         this.success = true
         this.selectedUser = response.data.user
         this.messages = [response.data.message]
         await this.fetchUsers()

       } catch (error) {
        if(isSwitch)
          this.selectedUser.isAdmin = !this.selectedUser.isAdmin
        this.success = false
        this.addErrors(error)
       }
       finally{
        this.roleChange = false
       }
    },
    async removeUser() {
      try {
        this.removing = true;
        await userService.removeUser(this.selectedUser._id);
        this.success = true;
        this.messages = ["User deleted"];
        this.removeDialog = false
        this.dialog = false
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
    async storeUpdate() {
      await this.$store.dispatch("files/fetchStorageUsage");
      await this.$store.dispatch("role/fetchRole");
      await this.$store.dispatch("auth/fetchData");
    },
  },
};
</script>
