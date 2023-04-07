import api from "./api";

class UserService {
  getPublicContent() {
    return api.get("/users/me");
  }

  getUserBoard() {
    return api.get("/users/me");
  }

  getAdminBoard() {
    return api.get("/users/me");
  }

  getStorageData() {
    return api.get("/users/storage");
  }
}

export default new UserService();
