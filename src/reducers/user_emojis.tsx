import { Emoji } from "@furxus/types";
import { createSlice } from "@reduxjs/toolkit";

export const userEmojisSlice = createSlice({
    name: "user_emojis",
    initialState: {
        emojis: [] as Emoji[],
    },
    reducers: {
        addEmoji: (state, action) => {
            return {
                ...state,
                emojis: [...state.emojis, action.payload],
            };
        },
        removeEmoji: (state, action) => {
            return {
                ...state,
                emojis: state.emojis.filter(
                    (emoji: Emoji) => emoji.id !== action.payload
                ),
            };
        },
        setEmojis: (state, action) => {
            return {
                ...state,
                emojis: action.payload,
            };
        },
        default: (state) => {
            return state;
        },
    },
});

export const { addEmoji, removeEmoji, setEmojis } = userEmojisSlice.actions;

export default userEmojisSlice.reducer;
