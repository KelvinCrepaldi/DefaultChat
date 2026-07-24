import axios from "axios";
import { io } from "socket.io-client";

const getApiUrl = () => {
  if (typeof window === "undefined") {
    return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "";
  }
  return process.env.NEXT_PUBLIC_API_URL || "";
};

const URL = getApiUrl();

const socket = io(URL, {
  autoConnect: false,
});
const api = axios.create({
  baseURL: URL,
});

export { api, socket };
