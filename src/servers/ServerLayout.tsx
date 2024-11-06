import ServerSidebar from "./components/ServerSidebar";
import { Outlet, useParams } from "react-router-dom";
import { FaBook } from "react-icons/fa";

import "@css/ServerSideContextMenu.css";
import Stack from "@mui/material/Stack";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";

const ServerLayout = () => {
    const { serverId } = useParams();

    const { isLoading, data: servers } = useQuery({
        queryKey: ["getUserServers"],
        queryFn: () => api.get("/@me/servers").then((res) => res.data),
    });

    if (isLoading) return <></>;

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
    if (!servers.find((srv: any) => srv.id === serverId)) return <></>;

    return (
        <Stack
            alignItems="flex-start"
            justifyContent="flex-start"
            direction="row"
            className="w-full h-full"
        >
            <ServerSidebar
                server={servers.find((srv: any) => srv.id === serverId)}
            />
            <Outlet />
        </Stack>
    );
};

export default ServerLayout;
