import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://103.158.196.32/its-resto/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});