import api from "../api/axios";
import type {UserRegister} from "../models/UserRegister.ts";
import type {UserLogin} from "../models/UserLogin.ts";

export const registerUser = async (data: UserRegister) => {
  const response = await api.post("/register", data);
  return response.data;
};

export const loginUser = async (data: UserLogin) => {
  const response = await api.post("/login", data);
  return response.data;
};