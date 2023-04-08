import { createStore } from "vuex";
import { auth } from "./auth.module";
import { files } from "./files.module";
import { role } from "./role.module";

const store = createStore({
  modules: {
    auth,
    role,
    files,
  },
});

export default store;
