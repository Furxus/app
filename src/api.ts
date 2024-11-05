import axios from "axios";
import { io } from "socket.io-client";

const apiUrl = import.meta.env.VITE_APP_URL;

const api = axios.create({
    baseURL: apiUrl + "/v2",
    headers: {
        "Content-Type": "application/json",
    },
});

const socket = io(import.meta.env.VITE_APP_URL, {
    path: "/v2/socket-io",
    autoConnect: false,
});

export { api, socket };
