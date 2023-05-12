<template>
  <v-card class="mx-10 pa-5">
    <v-card-title class="text-h6 font-weight-regular justify-space-between">
      <v-chip variant="outlined" color="primary" rounded>{{ step }}</v-chip>
      <span> Sign up</span>
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
          <v-alert v-if="!validateEmail" color="error">
            Email must be valid
          </v-alert>
          <span class="text-caption text-grey-darken-1">
            This is the email you will use to login to your Vuetify account
          </span>
        </v-card-text>
      </v-window-item>

      <v-window-item :value="2">
        <v-card-text>
          <v-text-field
            v-model="firstName"
            name="firstName"
            label="First name"
            placeholder="John"
          />
          <v-text-field
            v-model="lastName"
            name="lastName"
            label="Last name"
            placeholder="Smith"
          />
          <v-alert v-if="!validateString(firstName)" color="error">
            First name cannot not be empty
          </v-alert>
          <br />
          <v-alert v-if="!validateString(lastName)" color="error">
            Last name cannot not be empty
          </v-alert>
          <span class="text-caption text-grey-darken-1">
            This is your displayed personal information
          </span>
        </v-card-text>
      </v-window-item>

      <v-window-item :value="3">
        <v-card-text>
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
          ></v-text-field>
          <v-alert v-if="!validateString(password)" color="error">
            Password cannot be empty
          </v-alert>
          <span class="text-caption text-grey-darken-1">
            Please enter a password for your account
          </span>
        </v-card-text>
      </v-window-item>
    </v-window>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn v-if="step > 1" variant="text" @click="step--"> Back </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        v-if="step === 1 && validateEmail"
        color="primary"
        variant="flat"
        @click="step++"
      >
        Next
      </v-btn>
      <v-btn
        v-if="
          step === 2 && validateString(firstName) && validateString(lastName)
        "
        color="primary"
        variant="flat"
        @click="step++"
      >
        Next
      </v-btn>
      <v-btn
        v-if="step === 3 && validateString(password)"
        color="primary"
        variant="flat"
        :loading="loading"
        :disabled="loading"
        @click="handleRegister"
      >
        Sign up
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { useToast } from "vue-toastification";

export default {
  name: "SignUp",
  data() {
    return {
      step: 1,
      email: "",
      firstName: "",
      lastName: "",
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
    validateEmail() {
      // Simple email validation
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
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
      this.$router.push("/profile");
    }
  },
  methods: {
    async recaptcha() {
      await this.$recaptchaLoaded();

      const token = await this.$recaptcha("register");
      return token != null ? true : false;
    },
    async handleRegister() {
      this.messages = [];
      this.success = false;
      this.loading = true;

      try {
        if (await this.recaptcha()) {
          const data = await this.$store.dispatch("auth/register", {
            email: this.email,
            name: this.firstName + " " + this.lastName,
            password: this.password,
          });
          this.success = true;
          this.messages = [data.message];
          this.$router.push("/login");
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
