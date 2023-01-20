import api from "./api";
class AuthService {
  login(user) {
    return api
      .post("/auth/signin", {
        email: user.email,
        password: user.password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(user) {
    return api.post("/auth/signup", {
      name: user.name,
      email: user.email,
      password: user.password,
    });
  }
}

export default new AuthService();
