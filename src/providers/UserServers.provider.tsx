import { api } from "@/api";
import { addServer, removeServer, setServers } from "@/reducers/user_servers";
import { Server } from "@furxus/types";
import { useQuery } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const UserServersContext = createContext<{
    servers: Server[];
    addServer: (server: Server) => void;
    removeServer: (serverId: string) => void;
    setServers: (servers: Server[]) => void;
}>({
    servers: [],
    addServer: (_server: Server) => void 0,
    removeServer: (_serverId: string) => void 0,
    setServers: (_servers: Server[]) => void 0,
});

export function UserServersProvider({ children }: PropsWithChildren) {
    const dispatch = useDispatch();
    const servers = useSelector((state: any) => state.servers.servers);

    const { data: userServers } = useQuery({
        queryKey: ["getUserServers"],
        queryFn: () => api.get("/@me/servers").then((res) => res.data),
    });

    useEffect(() => {
        if (userServers) {
            dispatch(setServers(userServers));
        }
    }, [userServers]);

    const addServerFunc = (server: Server) => {
        dispatch(addServer(server));
    };

    const removeServerFunc = (serverId: string) => {
        dispatch(removeServer(serverId));
    };

    const setServersFunc = (servers: Server[]) => {
        dispatch(setServers(servers));
    };

    return (
        <UserServersContext.Provider
            value={{
                servers,
                addServer: addServerFunc,
                removeServer: removeServerFunc,
                setServers: setServersFunc,
            }}
        >
            {children}
        </UserServersContext.Provider>
    );
}
