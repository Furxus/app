import { createContext, PropsWithChildren } from "react";

import { useQuery } from "@tanstack/react-query";
import { Emoji as FurxusEmoji } from "@furxus/types";
import { api } from "@/api";

export const EmojisProviderContext = createContext<{
    customEmojis: FurxusEmoji[];
}>({
    customEmojis: [],
});

export function EmojisProvider({ children }: PropsWithChildren) {
    const { data: customEmojis } = useQuery<FurxusEmoji[]>({
        queryKey: ["getCustomEmojis"],
        queryFn: () => api.get("/emojis").then((res) => res.data),
    });

    return (
        <EmojisProviderContext.Provider
            value={{
                customEmojis: customEmojis || [],
            }}
        >
            {children}
        </EmojisProviderContext.Provider>
    );
}
