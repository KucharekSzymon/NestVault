import axiosInstance from "./api";
import TokenService from "./token.service";
import axios from "axios";

const setup = (store) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = TokenService.getLocalAccessToken();
      if (token) {
        config.headers["Authorization"] = "Bearer " + token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;

      if (originalConfig.url !== "/auth/signin" && err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          const tempConfig = {
            headers: {
              Authorization: `Bearer ${TokenService.getLocalRefreshToken()}`,
            },
          };
          try {
            const rs = await axios.get(
              "http://localhost:3000/auth/refresh",
              tempConfig
            );
            const { accessToken } = rs.data;
            const { refreshToken } = rs.data;

            store.dispatch("auth/refreshAccessToken", accessToken);
            TokenService.updateLocalAccessToken(accessToken);

            TokenService.updateLocalRefreshToken(refreshToken);

            return axiosInstance(originalConfig);
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
      }

      return Promise.reject(err);
    }
  );
};

export default setup;
