<template>
  <div>
    <div>
      <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" />
      <Form @submit="handleLogin" :validation-schema="schema">
        <div>
          <label for="email">Email</label>
          <Field name="email" type="text" />
          <ErrorMessage name="email" />
        </div>
        <div>
          <label for="password">Password</label>
          <Field name="password" type="password" />
          <ErrorMessage name="password" />
        </div>
        <div>
          <button
            :disabled="loading"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            <span v-show="loading"> <!--Logging loading bar --></span>
            <span>Login</span>
          </button>
        </div>

        <div v-if="messages" role="alert">
          <template v-if="Array.isArray(messages)">
            <v-alert
              type="error"
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
      </Form>
    </div>
  </div>
</template>
<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "SignIn",
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
        .email("Email is invalid!"),
      password: yup.string().required("Password is required!"),
    });

    return {
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
  created() {
    if (this.loggedIn) {
      this.$router.push("/user/dashboard");
    }
  },
  methods: {
    async handleLogin(user) {
      this.loading = true;

      try {
        await this.$store.dispatch("auth/login", user);
        await this.$store.dispatch("role/fetchRole");
        this.$router.push("/user/dashboard");
      } catch (error) {
        this.loading = false;
        this.messages = (error.response &&
        error.response.data &&
        Array.isArray(error.response.data.message)
          ? error.response.data.message
          : [error.response.data.message]) || [error.message] || [
            error.toString(),
          ];
      }
    },
  },
};
</script>
