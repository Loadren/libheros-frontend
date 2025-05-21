import type { AxiosInstance } from "axios";
import axios from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL || "",
});

export default api;
