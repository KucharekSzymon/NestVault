import api from "./api";

class AuthService {
  async login(user) {
    const response = await api.post("/auth/signin", {
      email: user.email,
      password: user.password,
    });
    if (response.data.accessToken) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  }

  async logout() {
    localStorage.removeItem("user");
    await api.get("/auth/logout");
  }

  async register(user) {
    const response = await api.post("/auth/signup", {
      name: user.name,
      email: user.email,
      password: user.password,
    });
    return response.data;
  }
  async checkRole() {
    const response = await api.get("/auth/role");
    return response.data;
  }
}

export default new AuthService();
