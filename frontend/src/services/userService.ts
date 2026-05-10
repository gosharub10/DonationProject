import api from "../api/axios";

import type {UserData} from "../models/UserData.ts";
import type {UserUpdate} from "../models/UserUpdate.ts";


export const getUsers = async (): Promise<UserData[]> => {
  const response = await api.get("/users");
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const updateUser = async (data: Partial<UserUpdate>) => {
  const res = await api.put(`/users`, data);
  return res.data;
};


export const getUserById = async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};
