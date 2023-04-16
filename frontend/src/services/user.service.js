import api from "./api";

class UserService {
  getMyData() {
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
