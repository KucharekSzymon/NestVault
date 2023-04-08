import userService from "../services/user.service";

export const files = {
  namespaced: true,
  state: {
    spaceUsed: null,
    spaceLimit: null,
    spaceLeft: null,
  },
  mutations: {
    setSpaceUsage(state, data) {
      state.spaceUsed = data.spaceUsed;
      state.spaceLimit = data.spaceLimit;
      state.spaceLeft = data.spaceLeft;
    },
  },
  actions: {
    async fetchStorageUsage({ commit }) {
      try {
        const response = await userService.getStorageData();
        const data = response.data;
        commit("setSpaceUsage", data);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
