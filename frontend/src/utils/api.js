import axios from "axios";
import { store } from ".././store/store";
import { logoutSuccess } from "../store/slices/authSlice";
import { clearWishlist } from "../store/slices/wishlistSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      store.dispatch(logoutSuccess());
      store.dispatch(clearWishlist());

      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

export default api;
