import { createStore } from "vuex";
import { auth } from "./auth.module";
import { files } from "./files.module";

const store = createStore({
  modules: {
    auth,
    files,
  },
});

export default store;
