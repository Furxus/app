import axios from "axios";
import { io } from "socket.io-client";

const apiUrl = import.meta.env.VITE_APP_URL;

const api = axios.create({
    baseURL: apiUrl + "/v2",
    headers: {
        "Content-Type": "application/json",
    },
});

if (localStorage.getItem("fx-token"))
    api.defaults.headers.common[
        "Authorization"
    ] = `Bearer ${localStorage.getItem("fx-token")}`;

const socket = io(import.meta.env.VITE_APP_URL, {
    path: "/v2/socket-io",
    autoConnect: false,
});

// Set the token if it exists
if (localStorage.getItem("fx-token"))
    socket.auth = { token: localStorage.getItem("fx-token") };

export { api, socket };
