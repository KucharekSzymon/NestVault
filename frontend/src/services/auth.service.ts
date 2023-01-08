import axios from "axios";

const API_URL = "localhost:3000/auth/"; // Change to env

class AuthService {
  signIn(user: { username: string; password: string }) {
    return axios
      .post(API_URL + "signin", {
        username: user.username,
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
  signUp(user: { email: string; username: string; password: string }) {
    return axios.post(API_URL + "signup", {
      email: user.email,
      username: user.username,
      password: user.password,
    });
  }
}
export default new AuthService();
