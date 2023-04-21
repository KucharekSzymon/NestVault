import filesService from "../services/files.service";

export const publicStats = {
  namespaced: true,
  state: {
    allFiles: 0,
    allUsers: 0,
    spaceUsed: 0,
  },

  mutations: {
    setStats(state, data) {
      state.allFiles = data.allFiles;
      state.allUsers = data.allUsers;
      state.spaceUsed = data.spaceUsed;
    },
  },
  actions: {
    async fetchStats({ commit }) {
      try {
        const response = await filesService.getStats();
        const data = response.data;
        commit("setStats", data);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
