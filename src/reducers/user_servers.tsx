import { Server } from "@furxus/types";
import { createSlice } from "@reduxjs/toolkit";

export const userServerSlice = createSlice({
    name: "user_servers",
    initialState: {
        servers: [] as Server[],
    },
    reducers: {
        addServer: (state, action) => {
            return {
                ...state,
                servers: [...state.servers, action.payload],
            };
        },
        removeServer: (state, action) => {
            return {
                ...state,
                servers: state.servers.filter(
                    (server: Server) => server.id !== action.payload
                ),
            };
        },
        setServers: (state, action) => {
            return {
                ...state,
                servers: action.payload,
            };
        },
        default: (state) => {
            return state;
        },
    },
});

export const { addServer, removeServer, setServers } = userServerSlice.actions;

export default userServerSlice.reducer;
