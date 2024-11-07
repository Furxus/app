import ServerSidebar from "./components/ServerSidebar";
import { Outlet, useParams } from "react-router-dom";
import { FaBook } from "react-icons/fa";

import "@css/ServerSideContextMenu.css";
import Stack from "@mui/material/Stack";
import { useUserServers } from "@/hooks";
import { Server } from "@furxus/types";

const ServerLayout = () => {
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

    if (!servers) return <></>;
    const server = servers.find((srv: Server) => srv.id === serverId);
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
