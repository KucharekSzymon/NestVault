import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3000/users/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'me');
  }

  getUserBoard() {
    return axios.get(API_URL + 'me', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'me', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'me', { headers: authHeader() });
  }
}

export default new UserService();
