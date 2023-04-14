import authService from "../services/auth.service";

export const role = {
  namespaced: true,
  state: {
    isAdmin: false,
  },
  mutations: {
    setRole(state, data) {
      state.isAdmin = data;
    },
  },
  actions: {
    async fetchRole({ commit }) {
      try {
        const response = await authService.checkRole();
        const data = response;
        commit("setRole", data);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
