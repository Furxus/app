import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
    },
    reducers: {
        updateUser: (state, action) => {
            return {
                ...state,
                user: action.payload,
            };
        },
        logout: (state) => {
            return {
                ...state,
                user: null,
            };
        },
        default: (state) => {
            return state;
        },
    },
});

export const { updateUser, logout } = authSlice.actions;

export default authSlice.reducer;
