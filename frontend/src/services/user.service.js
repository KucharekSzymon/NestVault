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
  getSpaceLeft() {
    return api.get("/users/spaceleft");
  }
  getSpaceLimit() {
    return api.get("/users/spacelimit");
  }
  getSpaceUsed() {
    return api.get("/users/spaceused");
  }
}

export default new UserService();
