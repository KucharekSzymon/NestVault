import AuthService from "../services/auth.service";

const user = JSON.parse(localStorage.getItem("user"));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    async login({ commit }, user) {
      const loggedInUser = await AuthService.login(user);
      commit("loginSuccess", loggedInUser);
      return loggedInUser;
    },

    logout({ commit }) {
      AuthService.logout();
      commit("logout");
    },

    async register({ commit }, user) {
      const response = await AuthService.register(user);
      commit("registerSuccess");
      return response;
    },

    refreshAccessToken({ commit }, accessToken) {
      if (user != null) commit("refreshAccessToken", accessToken);
    },
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },

    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },

    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },

    registerSuccess(state) {
      state.status.loggedIn = false;
    },

    registerFailure(state) {
      state.status.loggedIn = false;
    },

    refreshAccessToken(state, accessToken) {
      state.status.loggedIn = true;
      state.user = { ...state.user, accessToken: accessToken };
    },
  },
};
