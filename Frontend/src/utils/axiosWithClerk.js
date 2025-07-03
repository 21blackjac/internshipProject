// src/utils/axiosWithClerk.js
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

export const useAxiosWithClerk = () => {
  const { getToken } = useAuth();

  const instance = axios.create({
    baseURL: "http://localhost:3000/api",
  });

  instance.interceptors.request.use(async (config) => {
    const token = await getToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return instance;
};
