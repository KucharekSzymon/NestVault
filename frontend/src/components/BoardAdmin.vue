<template>
  <div class="container">
    <v-card :loading="loading">
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
      loading: true,
      content: "AdminBoard",
    };
  },
  async mounted() {
    try {
      const data = await UserService.getAdminBoard();
      this.content = data.data;
      this.loading = false;
    } catch (e) {
      console.log(e);
    }
  },
};
</script>
