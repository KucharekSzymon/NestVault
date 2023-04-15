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
      if (state.spaceLeft > 95) state.storageColor = "red-accent-4 93";
      else if (state.spaceLeft > 80) state.storageColor = "amber-darken-4 84";
      else if (state.spaceLeft > 65) state.storageColor = "amber";
      else if (state.spaceLeft > 50) state.storageColor = "yellow";
      else if (state.spaceLeft > 30) state.storageColor = "yellow";
      else if (state.spaceLeft > 15) state.storageColor = "yellow";
      else state.storageColor = "";
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
