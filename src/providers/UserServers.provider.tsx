import { api } from "@/api";
import { useAppStore } from "@/hooks/useAppStore";
import { Server } from "@furxus/types";
import { useQuery } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useEffect } from "react";

export const UserServersContext = createContext<{
    servers: Server[];
}>({
    servers: [],
});

export function UserServersProvider({ children }: PropsWithChildren) {
    const { servers } = useAppStore();
    const { data: userServers } = useQuery({
        queryKey: ["getUserServers"],
        queryFn: () => api.get("/@me/servers").then((res) => res.data),
        enabled: localStorage.getItem("token") !== null,
    });

    useEffect(() => {
        if (userServers) {
            servers.addAll(userServers);
        }
    }, [userServers]);

    return (
        <UserServersContext.Provider
            value={{
                servers: userServers ?? [],
            }}
        >
            {children}
        </UserServersContext.Provider>
    );
}
