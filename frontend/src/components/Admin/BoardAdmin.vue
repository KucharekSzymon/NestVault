<template>
  <div class="container">
    <header>
      <pre>
        {{ content }}
      </pre>
    </header>
  </div>
</template>

<script>
import UserService from "../../services/user.service";

export default {
  name: "AdminBoard",

  async mounted() {
    try {
      const res = await UserService.getAdminBoard();
      this.content = res.data;
      this.loading = false;
    } catch (e) {
      console.log(e);
    }
  },
  data() {
    return {
      content: "AdminBoard",
      loading: false,
      items: [],
      search: null,
      select: null,
    };
  },
};
</script>
