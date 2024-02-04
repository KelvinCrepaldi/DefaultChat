import axios from "axios";
import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_API_URL as string;

const socket = io(URL, {
  autoConnect: false,
});
const api = axios.create({
  baseURL: URL,
});

export { api, socket };
