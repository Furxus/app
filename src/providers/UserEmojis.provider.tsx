import { api } from "@/api";
import { setEmojis, addEmoji, removeEmoji } from "@/reducers/user_emojis";
import { useQuery } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const UserEmojisContext = createContext<{
    emojis: any[];
    addEmoji: (emoji: any) => void;
    removeEmoji: (emojiId: string) => void;
    setEmojis: (emojis: any[]) => void;
}>({
    emojis: [],
    addEmoji: (_emoji: any) => void 0,
    removeEmoji: (_emojiId: string) => void 0,
    setEmojis: (_emojis: any[]) => void 0,
});

export function UserEmojisProvider({ children }: PropsWithChildren) {
    const dispatch = useDispatch();
    const emojis = useSelector((state: any) => state.emojis.emojis);

    const { data: userEmojis } = useQuery({
        queryKey: ["getUserEmojis"],
        queryFn: () => api.get("/@me/emojis").then((res) => res.data),
    });

    useEffect(() => {
        if (userEmojis) {
            dispatch(setEmojis(userEmojis));
        }
    }, [userEmojis]);

    const addEmojiFunc = (emoji: any) => {
        dispatch(addEmoji(emoji));
    };

    const removeEmojiFunc = (emojiId: string) => {
        dispatch(removeEmoji(emojiId));
    };

    const setEmojisFunc = (emojis: any[]) => {
        dispatch(setEmojis(emojis));
    };

    return (
        <UserEmojisContext.Provider
            value={{
                emojis,
                addEmoji: addEmojiFunc,
                removeEmoji: removeEmojiFunc,
                setEmojis: setEmojisFunc,
            }}
        >
            {children}
        </UserEmojisContext.Provider>
    );
}
