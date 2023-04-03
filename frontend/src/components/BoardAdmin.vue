<template>
  <div class="container">
    <v-card>
      <v-autocomplete
        clearable
        chips
        label="Autocomplete"
        :items="[
          'California',
          'Colorado',
          'Florida',
          'Georgia',
          'Texas',
          'Wyoming',
        ]"
        multiple
      ></v-autocomplete>
    </v-card>
    <header>
      <pre>
        {{ content }}
      </pre>
    </header>
  </div>
</template>

<script>
import UserService from "../services/user.service";

export default {
  name: "Admin",
  data() {
    return {
      content: "AdminBoard",
    };
  },
  mounted() {
    UserService.getAdminBoard().then(
      (response) => {
        this.content = response.data;
      },
      (error) => {
        this.content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      }
    );
  },
};
</script>
