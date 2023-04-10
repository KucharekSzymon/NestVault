import userService from "../services/user.service";

export const files = {
  namespaced: true,
  state: {
    spaceUsed: null,
    spaceLimit: null,
    spaceLeft: null,
    storageColor: "",
  },
  mutations: {
    setSpaceUsage(state, data) {
      state.spaceUsed = data.spaceUsed;
      state.spaceLimit = data.spaceLimit;
      state.spaceLeft = data.spaceLeft;
      if (state.spaceLeft < 30) state.storageColor = "";
      else if (state.spaceLeft < 50) state.storageColor = "green";
      else if (state.spaceLeft < 75) state.storageColor = "amber";
      else if (state.spaceLeft < 90) state.storageColor = "red";
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
