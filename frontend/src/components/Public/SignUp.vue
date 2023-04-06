<template>
  <div>
    <div>
      <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" />
      <Form @submit="handleRegister" :validation-schema="schema">
        <div v-if="!successful">
          <div>
            <label for="email">Email</label>
            <Field name="email" type="email" />
            <ErrorMessage name="email" />
          </div>
          <div>
            <label for="name">Name</label>
            <Field name="name" type="text" />
            <ErrorMessage name="name" />
          </div>
          <div>
            <label for="password">Password</label>
            <Field name="password" type="password" />
            <ErrorMessage name="password" />
          </div>

          <div>
            <button
              :disabled="loading"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <span v-show="loading"></span>
              Sign Up
            </button>
          </div>
        </div>
      </Form>

      <div v-if="messages" role="alert">
        <template v-if="Array.isArray(messages)">
          <v-alert
            :type="successful ? 'success' : 'error'"
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
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "SignUp",
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      email: yup
        .string()
        .required("Email is required!")
        .email("Email is invalid!")
        .max(50, "Must be maximum 50 characters!"),
      name: yup
        .string()
        .required("Name is required!")
        .min(3, "Must be at least 3 characters!")
        .max(20, "Must be maximum 20 characters!"),
      password: yup
        .string()
        .required("Password is required!")
        .min(6, "Must be at least 6 characters!")
        .max(40, "Must be maximum 40 characters!"),
    });

    return {
      successful: false,
      loading: false,
      messages: [],
      schema,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },
  methods: {
    async handleRegister(user) {
      this.messages = [];
      this.successful = false;
      this.loading = true;

      try {
        const data = await this.$store.dispatch("auth/register", user);
        this.messages = [data.message];
        this.successful = true;
      } catch (error) {
        this.messages = (error.response &&
        error.response.data &&
        Array.isArray(error.response.data.message)
          ? error.response.data.message
          : [error.response.data.message]) || [error.message] || [
            error.toString(),
          ];
        this.successful = false;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
