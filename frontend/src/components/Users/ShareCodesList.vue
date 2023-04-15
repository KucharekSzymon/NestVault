<template>
  <div>
    <v-card :loading="loading" class="pa-2">
      <v-row class="d-flex justify-space-between pa-2">
        <v-col class="subtitle-1 font-weight-bold">My share codes</v-col>
      </v-row>
      <v-autocomplete
        v-if="codes.length !== 0"
        clearable
        v-model="selectedSearch"
        label="Find a code"
        :loading="loading"
        :items="codes"
        item-title="_id"
        item-value="_id"
      >
        <template v-slot:append>
          <v-slide-x-reverse-transition mode="out-in">
            <v-icon
              color="primary"
              :loading="loading"
              v-if="selectedSearch"
              icon="fa fa-angles-right"
              @click="findCode(selectedSearch)"
            ></v-icon>
          </v-slide-x-reverse-transition>
        </template>
      </v-autocomplete>
      <v-row>
        <v-expansion-panels v-model="selectedCode" variant="popout">
          <v-expansion-panel v-for="(code, index) in codes" :key="index">
            <v-expansion-panel-title>
              <v-row>
                <v-col class="d-flex justify-start">
                  <v-icon
                    :color="
                      new Date(code.expireTime) > new Date()
                        ? 'success'
                        : 'error'
                    "
                    :icon="
                      new Date(code.expireTime) > new Date()
                        ? 'fa-solid fa-circle-check'
                        : 'fa-solid fa-triangle-exclamation'
                    "
                  ></v-icon>
                  <v-divider vertical class="mx-4"></v-divider>
                  {{ code._id }}
                </v-col>
              </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row>
                <v-col> Description </v-col>
                <v-col> Create Time </v-col>
                <v-col> Expire Time </v-col>
                <v-divider vertical class="mx-4"></v-divider>
                <v-col> Uses</v-col>
                <v-divider vertical class="mx-4"></v-divider>
                <v-col> Actions </v-col>
              </v-row>
              <v-row>
                <v-col class="text--secondary">
                  <span>
                    {{ code.description }}
                  </span>
                </v-col>
                <v-col>
                  {{ code.createTime }}
                </v-col>
                <v-col>
                  {{ code.expireTime }}
                </v-col>
                <v-divider vertical class="mx-4"></v-divider>
                <v-col>
                  <v-row v-for="(use, index) in code.usedBy" :key="index">
                    <v-col> {{ use.name }} - {{ use.email }} </v-col>
                  </v-row>
                </v-col>
                <v-divider vertical class="mx-4"></v-divider>

                <v-col>
                  <v-btn-group
                    ><v-btn
                      color="primary"
                      :loading="removing"
                      prepend-icon="fa-regular fa-clipboard"
                      @click="copyCode(code._id)"
                    >
                      Copy
                    </v-btn>
                    <v-btn
                      color="error"
                      :loading="removing"
                      icon="fa fa-trash"
                      @click="removeCode(code._id)"
                    >
                    </v-btn> </v-btn-group
                ></v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import shareCodeService from "../../services/shareCode.service";
import { useToast } from "vue-toastification";

export default {
  name: "ShareCodesList",

  data() {
    return {
      loading: true,
      codes: [],
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
    this.fetchCodes();
  },
  methods: {
    async fetchCodes() {
      try {
        const res = await shareCodeService.getMyUrls();
        this.codes = res.data;
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async removeCode(codeId) {
      this.removing = true;
      try {
        const response = await shareCodeService.remove(codeId);
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
      const index = this.codes.findIndex((code) => code._id === selectedSearch);
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
