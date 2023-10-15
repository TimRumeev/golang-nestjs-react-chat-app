import env from "../constants/env.constants";
import axios from "axios";

const apiService = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default apiService;
