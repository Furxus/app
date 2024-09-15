import { useQuery } from "@apollo/client";
import ServerSidebar from "./components/ServerSidebar";
import { GetUserServers } from "../gql/servers";
import { Outlet, useParams } from "react-router-dom";
import { FaBook } from "react-icons/fa";

import "../css/ServerSideContextMenu.css";
import Stack from "@mui/material/Stack";

const ServerLayout = () => {
    const { serverId } = useParams();

    const { loading, data: { getUserServers: servers = [] } = {} } =
        useQuery(GetUserServers);

    if (loading) return <></>;

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
