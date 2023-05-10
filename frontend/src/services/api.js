import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    ContentType: "application/json",
  },
});

export default axiosInstance;
