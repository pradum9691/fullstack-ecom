import api from "./api";

export const logout = async () => {
  await api.post("/auth/logout");
};
