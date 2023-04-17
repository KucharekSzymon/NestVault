import api from "./api";

class UserService {
  getMyData() {
    return api.get("/users/me");
  }
  updateUserData(data, userId) {
    return api.patch("/users/update/" + userId, data);
  }
  updateStorageLimit(data) {
    return api.post("/users/storageLimit", data);
  }
  promote(userId) {
    return api.post("/users/promote/" + userId);
  }
  demote(userId) {
    return api.post("/users/demote/" + userId);
  }
  getStorageData() {
    return api.get("/users/storage");
  }
  getAllUsers() {
    return api.get("/users");
  }
  getAllUsersAdmin() {
    return api.get("/users/all");
  }
  removeUser(userId) {
    return api.delete("/users/" + userId);
  }
}

export default new UserService();
