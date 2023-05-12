<template>
  <v-card class="mx-10 pa-5 w-100">
    <v-card-title class="text-h6 font-weight-regular justify-space-between">
      <v-chip variant="outlined" color="primary" rounded>{{ step }}</v-chip>
      <span> Sign in</span>
    </v-card-title>

    <v-window v-model="step">
      <v-window-item :value="1">
        <v-card-text>
          <v-text-field
            v-model="email"
            name="Email"
            label="Email"
            type="Email"
            placeholder="example@email.com"
          ></v-text-field>
          <v-slide-x-reverse-transition mode="out-in">
            <v-alert v-if="!validateString(email)" color="error">
              Email must be valid
            </v-alert>
          </v-slide-x-reverse-transition>
        </v-card-text>
      </v-window-item>

      <v-window-item :value="2">
        <v-card-text>
          <v-text-field v-model="password" label="Password" type="password" />
          <v-slide-x-reverse-transition mode="out-in">
            <v-alert v-if="!validateString(password)" color="error">
              Password cannot be empty
            </v-alert>
          </v-slide-x-reverse-transition>
        </v-card-text>
      </v-window-item>
    </v-window>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn v-if="step > 1" variant="text" @click="step--"> Back </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        v-if="step === 1 && validateString(email)"
        color="primary"
        variant="flat"
        @click="step++"
      >
        Next
      </v-btn>

      <v-btn
        v-if="step === 2 && validateString(password)"
        color="primary"
        variant="flat"
        :loading="loading"
        :disabled="loading"
        @click="handleLogin"
      >
        Sign in
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { useToast } from "vue-toastification";

export default {
  name: "SignIn",
  data() {
    return {
      step: 1,
      email: "",
      password: "",
      success: false,
      loading: false,
      messages: [],
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
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
    if (this.loggedIn) {
      this.$router.push("/user/");
    }
  },
  methods: {
    async recaptcha() {
      await this.$recaptchaLoaded();

      const token = await this.$recaptcha("login");
      return token != null ? true : false;
    },
    async handleLogin() {
      this.messages = [];
      this.success = false;
      this.loading = true;

      try {
        if (await this.recaptcha()) {
          await this.$store.dispatch("auth/login", {
            email: this.email,
            password: this.password,
          });
          await this.$store.dispatch("role/fetchRole");

          this.success = true;
          this.messages = ["Signed in succesfully"];
          this.$router.push("/user/");
        }
      } catch (error) {
        this.success = false;
        this.addErrors(error);
      } finally {
        this.loading = false;
      }
    },
    validateString(text) {
      return text.length == 0 ? false : true;
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
