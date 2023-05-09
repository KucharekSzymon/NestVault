import { createStore } from "vuex";
import { auth } from "./auth.module";
import { files } from "./files.module";
import { role } from "./role.module";
import { publicStats } from "./publicStats.module";

const store = createStore({
  modules: {
    publicStats,
    auth,
    role,
    files,
  },
});

export default store;
