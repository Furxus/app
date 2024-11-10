import ServerSidebar from "./components/ServerSidebar.component";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { FaBook } from "react-icons/fa";

import "@css/ServerSideContextMenu.css";
import Stack from "@mui/material/Stack";
import { useUserServers } from "@/hooks";
import { Server } from "@furxus/types";
import { useEffect } from "react";
import { socket } from "@/api";

const ServerLayout = () => {
    const navigate = useNavigate();
    const { serverId } = useParams();
    const { servers } = useUserServers();

    if (servers.length === 0)
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

    const server = servers.find((srv: Server) => srv.id === serverId);

    useEffect(() => {
        if (!server) {
            navigate(`/servers/${servers[0].id}`);
        }

        if (server) {
            socket.emit("server:focus", serverId);
            return () => {
                socket.emit("server:blur", serverId);
            };
        }
    }, [serverId]);

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

export default ServerLayout;
