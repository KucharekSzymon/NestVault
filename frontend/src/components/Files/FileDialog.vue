<template>
  <div>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        fullscreen
        persistent
        :scrim="false"
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark color="primary">
            <v-toolbar-items>
              <v-btn
                icon="fa fa-xmark"
                size="large"
                @click="closeDialog"
              ></v-btn>
            </v-toolbar-items>
            <v-toolbar-title>
              {{ currentFile.name }} -
              <span>{{ convertSize(currentFile.size) }}</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn-group>
                <v-btn
                  size="large"
                  color="info"
                  prepend-icon="fa fa-share"
                  @click="shareNestedDialog = true"
                >
                  Share
                </v-btn>
                <v-btn
                  size="large"
                  color="success"
                  prepend-icon="fa fa-floppy-disk"
                  :loading="downloadLink == null"
                  :href="downloadLink"
                  target="_blank"
                  :download="currentFile.name"
                >
                  Download
                </v-btn>
                <v-btn
                  size="large"
                  color="error"
                  icon="fa fa-trash"
                  @click="removeNestedDialog = true"
                />
              </v-btn-group>
            </v-toolbar-items>
          </v-toolbar>
          <v-divider></v-divider>
          <v-card v-if="fileUrl == null">
            <v-progress-circular
              color="primary"
              indeterminate
              size="64"
            ></v-progress-circular>
            <span>Loading preview</span>
          </v-card>
          <v-card v-else>
            <div>
              <div v-if="fileType === 'image'">
                <img class="previewFile" :src="fileUrl" alt="Image preview" />
              </div>
              <div v-else-if="fileType === 'video'">
                <video class="previewFile" :src="fileUrl" controls></video>
              </div>
              <!-- <div v-else-if="fileType === 'pdf'">
                <iframe :src="fileUrl" frameborder="0"></iframe>
              </div> -->
              <div v-else-if="fileType === 'audio'">
                <audio class="previewFile" :src="fileUrl" controls></audio>
              </div>
              <div v-else>Unsupported file type</div>
            </div>
          </v-card>
          <v-dialog
            v-model="removeNestedDialog"
            persistent
            width="auto"
            transition="dialog-bottom-transition"
          >
            <v-card>
              <v-toolbar v-if="messages.length == 0">
                <v-toolbar-items>
                  <v-btn
                    icon="fa fa-xmark"
                    size="large"
                    @click="removeNestedDialog = false"
                  ></v-btn>
                </v-toolbar-items>
                <v-toolbar-title> Are you sure? </v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <div v-if="messages" role="alert">
                <template v-if="Array.isArray(messages)">
                  <v-alert
                    :type="removalSuccess ? 'success' : 'error'"
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
              <v-btn-group rounded="sm">
                <v-btn
                  :width="removalSuccess ? '100%' : 'auto'"
                  href="/files/mine"
                  color="info"
                  prepend-icon="fa fa-share"
                >
                  Return to my files
                </v-btn>
                <v-btn
                  v-if="!removalSuccess"
                  color="error"
                  prepend-icon="fa fa-trash"
                  @click="fileRemoval"
                  :disabled="messages.length !== 0"
                  :loading="messages.length !== 0"
                  >Remove pernamently
                </v-btn>
              </v-btn-group>
            </v-card>
          </v-dialog>
          <v-dialog
            v-model="shareNestedDialog"
            width="60vw"
            transition="dialog-bottom-transition"
          >
            <v-card>
              <v-toolbar>
                <v-toolbar-items>
                  <v-btn
                    icon="fa fa-xmark"
                    size="large"
                    @click="shareNestedDialog = false"
                  ></v-btn>
                </v-toolbar-items>
                <v-toolbar-title> Share</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <div v-if="messages" role="alert">
                <template v-if="Array.isArray(messages)">
                  <v-alert
                    :type="shareSuccess ? 'success' : 'error'"
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
              <div class="d-flex flex-row">
                <v-tabs
                  class="w-50"
                  v-model="tab"
                  direction="vertical"
                  color="primary"
                >
                  <v-tab prepend-icon="fa fa-link" value="url">
                    Share URL
                  </v-tab>
                  <v-tab prepend-icon="fa fa-user" value="user">
                    Share to user
                  </v-tab>
                  <v-tab prepend-icon="fa fa-list-check" value="accessList">
                    Access List
                  </v-tab>
                  <v-tab prepend-icon="fa fa-ban" value="revoke">
                    Revoke access
                  </v-tab>
                </v-tabs>
                <v-window v-model="tab" class="w-100">
                  <v-window-item value="url">
                    <v-form>
                      <v-container>
                        <v-text-field
                          v-model="description"
                          label="Description"
                        ></v-text-field>

                        <v-text-field
                          type="datetime-local"
                          v-model="expireTime"
                          label="Expire time"
                        ></v-text-field>
                      </v-container>
                    </v-form>
                  </v-window-item>
                  <v-window-item value="user">
                    <v-autocomplete
                      clearable
                      v-model="shareTo"
                      label="Select user"
                      :loading="users.length === 0"
                      :items="users"
                      item-title="name"
                      item-value="_id"
                    >
                    </v-autocomplete>
                  </v-window-item>
                  <v-window-item value="accessList">
                    <v-progress-linear
                      v-if="authorizedUsersLoading"
                      indeterminate
                      rounded
                      absolute
                      bottom
                    ></v-progress-linear>
                    <v-list v-if="authorizedUsers.length !== 0">
                      <v-list-item
                        v-for="user in authorizedUsers"
                        :key="user._id"
                        :title="user.name"
                        :subtitle="user.email"
                      >
                        <template v-slot:append>
                          <v-tooltip location="start" text="Revoke access">
                            <template v-slot:activator="{ props }">
                              <v-btn
                                v-bind="props"
                                color="grey-lighten-1"
                                size="xs"
                                icon="fa fa-xmark"
                                @click="revokeAccess(user._id)"
                              ></v-btn>
                            </template>
                          </v-tooltip>
                        </template>
                      </v-list-item>
                    </v-list>
                    <span
                      v-if="
                        authorizedUsers.length === 0 && !authorizedUsersLoading
                      "
                    >
                      No user has been given access to this file
                    </span>
                  </v-window-item>
                  <v-window-item value="revoke">
                    <v-autocomplete
                      clearable
                      v-model="revokeFrom"
                      label="Select user"
                      :loading="users.length === 0"
                      :items="users"
                      item-title="name"
                      item-value="_id"
                    >
                    </v-autocomplete>
                    <v-btn @click="revokeAccessAll" :disabled="!isChecked"
                      >Revoke access to all users</v-btn
                    >

                    <v-checkbox
                      label="Are you sure? This option remove all users access to this file"
                      v-model="isChecked"
                    ></v-checkbox>
                  </v-window-item>
                </v-window>
              </div>
              <v-btn
                color="info"
                prepend-icon="fa fa-share"
                rounded="sm"
                :loading="shareLoading"
                @click="newShare"
              >
                {{ shareButtonText }}
              </v-btn>
            </v-card>
          </v-dialog>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script lang="js">
import filesService from "../../services/files.service";
import usersService from "../../services/user.service";
import shareUrlService from "../../services/shareUrl.service";

export default {
  name: "FilePreviewDialog",
  props: ['currentFile'],
  data() {
    return {
      dialog: true,
      fileUrl: null,
      shareNestedDialog: false,
      shareButtonText: "Share",
      fileType: null,
      removeNestedDialog: false,
      downloadLink: null,
      messages: [],
      removalSuccess: false,
      tab: "url",
      share: null,
      tooltipText: "Click to copy",
      description: null,
      expireTime: null,
      shareLoading: false,
      shareSuccess: false,
      users: [],
      authorizedUsers: [],
      authorizedUsersLoading: false,
      shareTo: null,
      revokeFrom: null,
      isChecked: false,
    };
  },
  async mounted() {
    await this.fetchFilePreview()
    await this.fetchDownload()

    this.$watch('tab', async () => {
      this.messages = [];
      this.isChecked = false;
      (this.tab == 'revoke') ? this.shareButtonText = 'Revoke access' : this.shareButtonText = 'Share'

      await this.fetchUsers()
      await this.fecthAuthorized()
    });
  },
  methods: {
    async fetchFilePreview() {
      this.fileType = this.getFileType(this.currentFile.type);;
      if (this.fileType != null) {
        const response = await filesService.previewFile(this.currentFile._id)
        this.fileUrl = URL.createObjectURL(response.data);
      }
    },
    async fetchDownload() {
      try {
        const response = await filesService.downloadFile(this.currentFile._id)
        const link = window.URL.createObjectURL(new Blob([response.data]));
        this.downloadLink = link
      } catch (error) {
        console.log(error);
      }
    },
    async fetchUsers() {
      try {
        this.users = []
        const response = await usersService.getAllUsers()
        this.users = response.data
      } catch (error) {
        console.log(error);
      }
    },
    async fecthAuthorized() {
      try {
        this.authorizedUsersLoading = true;
        this.authorizedUsers = []
        const response = await filesService.getAuthorized(this.currentFile._id)
        this.authorizedUsers = response.data
      } catch (error) {
        console.log(error);
      }
      this.authorizedUsersLoading = false;
    },
    async fileRemoval() {
      this.removalSuccess = false
      try {
        const response = await filesService.removeFile(this.currentFile._id)
        this.updateSpaceUsage()
        this.messages = [response.data.message];
        this.removalSuccess = true
      } catch (error) {
        this.removalSuccess = false
        this.messages = (error.response &&
          error.response.data &&
          Array.isArray(error.response.data.message)
          ? error.response.data.message
          : [error.response.data.message]) || [error.message] || [
            error.toString(),
          ];
      }
    },
    async newShare() {
      this.shareLoading = true;
      if (this.tab == "url") {
        const data = { "file": this.currentFile._id, "description": this.description, "expireTime": this.expireTime }
        this.messages = []
        try {
          const response = await shareUrlService.newUrl(data)
          this.messages = [response.data._id]
          this.shareSuccess = true

        } catch (error) {
          this.shareSuccess = false
          this.messages = (error.response &&
            error.response.data &&
            Array.isArray(error.response.data.message)
            ? error.response.data.message
            : [error.response.data.message]) || [error.message] || [
              error.toString(),
            ];
        }
        this.shareLoading = false

      }
      else if (this.tab == "user") {
        try {
          const response = await filesService.share({ fileId: this.currentFile._id, userId: this.shareTo })
          this.messages = [response.data.message]
          this.shareSuccess = true

        } catch (error) {
          this.shareSuccess = false
          this.messages = (error.response &&
            error.response.data &&
            Array.isArray(error.response.data.message)
            ? error.response.data.message
            : [error.response.data.message]) || [error.message] || [
              error.toString(),
            ];
        }
        this.shareLoading = false

      } else if (this.tab == "revoke") {
        try {
          const response = await filesService.revoke({ fileId: this.currentFile._id, userId: this.revokeFrom })
          this.messages = [response.data.message]
          this.shareSuccess = true

        } catch (error) {
          this.shareSuccess = false
          this.messages = (error.response &&
            error.response.data &&
            Array.isArray(error.response.data.message)
            ? error.response.data.message
            : [error.response.data.message]) || [error.message] || [
              error.toString(),
            ];
        }
        this.shareLoading = false

      }
    },
    async revokeAccess(userId) {
      this.shareLoading = true
      try {
        const response = await filesService.revoke({ fileId: this.currentFile._id, userId: userId })
        this.messages = [response.data.message]
        this.shareSuccess = true
        await this.fecthAuthorized()
      } catch (error) {
        this.shareSuccess = false
        this.messages = (error.response &&
          error.response.data &&
          Array.isArray(error.response.data.message)
          ? error.response.data.message
          : [error.response.data.message]) || [error.message] || [
            error.toString(),
          ];
      }
      this.shareLoading = false

    },
    async revokeAccessAll(){
      try {
        const response = await filesService.revokeAll(this.currentFile._id)
        this.messages = [response.data.message]
        this.shareSuccess = true
      } catch (error) {
        this.shareSuccess = false
        this.messages = (error.response &&
          error.response.data &&
          Array.isArray(error.response.data.message)
          ? error.response.data.message
          : [error.response.data.message]) || [error.message] || [
            error.toString(),
          ];
      }
    },
    async updateSpaceUsage() {
      await this.$store.dispatch("files/fetchStorageUsage");
    },
    closeDialog() {
      this.$emit('close');
    },
    getFileType(type) {
      const partType = type.split('/')[0];
      if (partType == 'image') {
        return 'image';
      } else if (partType == 'video') {
        return 'video';
      } else if (partType == 'audio') {
        return 'audio'
      } else if (type == 'application/pdf') {
        return 'pdf';
      } else {
        return null;
      }
    },
    convertSize(size) {
      return filesService.convertSize(size)
    },
  },
};
</script>

<style>
.previewFile {
  max-width: 100%;
  max-height: 90vh;
}
</style>
