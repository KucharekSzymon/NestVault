<template>
  <div class="container">
    <header>
      <h3>{{ content }}</h3>
    </header>
  </div>
</template>

<script>
import UserService from "../../services/user.service";
import eventBus from "../../common/eventBus";

export default {
  name: "UserBoard",
  data() {
    return {
      content: "",
    };
  },
  mounted() {
    UserService.getUserBoard().then(
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

        if (error.response && error.response.status === 403) {
          eventBus.dispatch("logout");
        }
      }
    );
  },
};
</script>