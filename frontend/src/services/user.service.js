import api from "./api";

class UserService {
  checkAdminPerrmissions() {
    return api.get("/auth/role");
  }
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
    return 8; //api.get("/users/spaceleft");
  }
  getSpaceLimit() {
    return 10; //api.get("/users/spacelimit");
  }
  getSpaceUsed() {
    return 2; //api.get("/users/spaceused");
  }
}

export default new UserService();
