import ServerSidebar from "./components/ServerSidebar.component";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { FaBook } from "react-icons/fa";

import "@css/ServerSideContextMenu.css";
import Stack from "@mui/material/Stack";
import { Server } from "@furxus/types";
import { useEffect, useState } from "react";
import { api, socket } from "@/api";
import { observer } from "mobx-react-lite";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/hooks/useAppStore";

const ServerLayout = () => {
    const app = useAppStore();
    const navigate = useNavigate();
    const [server, setServer] = useState<Server | null>(null);

    const { data: servers } = useQuery<Server[]>({
        queryKey: ["getUserServers"],
        queryFn: () => api.get("/@me/servers").then((res) => res.data),
        enabled: localStorage.getItem("token") !== null,
    });

    const { serverId, channelId } = useParams();

    useEffect(() => {
        if (servers) {
            app.servers.addAll(servers);
            let server = servers.find((s) => s.id === serverId);
            if (!server) {
                server = servers[0];
            }
            if (server) {
                setServer(server);
                app.servers.set(server);
                if (!serverId) {
                    navigate(`/servers/${server.id}`);
                }

                if (!channelId) {
                    const channelId = server.channels[0];
                    if (channelId) {
                        navigate(`/servers/${server.id}/${channelId}`);
                    }
                }
            }
        }
    }, [servers, serverId, channelId]);

    useEffect(() => {
        if (server) {
            socket.emit("server:focus", serverId);
        }

        return () => {
            socket.emit("server:blur", serverId);
        };
    }, [serverId, server]);

    if (servers?.length === 0)
        return (
            <Stack
                alignItems="center"
                justifyContent="center"
                direction="row"
                className="w-full h-full"
                gap={1}
            >
                <span>
                    <FaBook size={32} />
                </span>
                <span className="text-lg text-gray-500">
                    You don&apos;t have any servers
                </span>
            </Stack>
        );

    if (!servers) return <></>;
    if (!server) return <></>;

    return (
        <Stack
            alignItems="flex-start"
            justifyContent="flex-start"
            direction="row"
            className="w-full h-full"
        >
            <ServerSidebar server={server} />
            <Outlet />
        </Stack>
    );
};

export default observer(ServerLayout);
