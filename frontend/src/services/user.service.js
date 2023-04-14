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
  getAllUsers() {
    return api.get("/users");
  }
}

export default new UserService();
