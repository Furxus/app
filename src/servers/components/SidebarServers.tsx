import SidebarAddServerIcon from "./SidebarAddServerIcon";
import { useQuery } from "@apollo/client";
import {
    GetUserServers,
    OnServerCreated,
    OnServerDeleted,
    OnServerJoined,
    OnServerLeft,
} from "@gql/servers";
import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import ServerListItem from "./ServerListItem";
import { useAuth } from "@hooks";
import { Server } from "@furxus/types";
import Stack from "@mui/material/Stack";

const SidebarServers = () => {
    const { serverId } = useParams();
    const { user } = useAuth();

    const { subscribeToMore, data: { getUserServers: servers = [] } = {} } =
        useQuery(GetUserServers);

    useEffect(() => {
        const unsubcribe = subscribeToMore({
            document: OnServerCreated,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const newServer: Server = subscriptionData.data.serverCreated;
                if (!newServer) return;

                return {
                    getUserServers: [newServer, ...prev.getUserServers],
                };
            },
            variables: {
                userId: user?.id,
            },
        });

        return () => unsubcribe();
    }, []);

    useEffect(() => {
        const unsubcribe = subscribeToMore({
            document: OnServerJoined,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const newServer: Server = subscriptionData.data.serverJoined;
                if (!newServer) return;
                if (
                    prev.getUserServers.find(
                        (srv: any) => srv.id === newServer.id
                    )
                )
                    return prev;

                // Sort servers by the most recent joined
                return {
                    getUserServers: [newServer, ...prev.getUserServers],
                };
            },
            variables: {
                userId: user?.id,
            },
        });

        return () => unsubcribe();
    }, []);

    useEffect(() => {
        const unsubcribe = subscribeToMore({
            document: OnServerLeft,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const server: Server = subscriptionData.data.serverLeft;
                if (!server) return;

                return {
                    getUserServers: prev.getUserServers.filter(
                        (srv: any) => srv.id !== server.id
                    ),
                };
            },
            variables: {
                userId: user?.id,
            },
        });

        return () => unsubcribe();
    }, []);

    useEffect(() => {
        const unsubcribe = subscribeToMore({
            document: OnServerDeleted,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const server: Server = subscriptionData.data.serverDeleted;
                if (!server) return;

                return {
                    getUserServers: prev.getUserServers.filter(
                        (srv: any) => srv.id !== server.id
                    ),
                };
            },
            variables: {
                userId: user?.id,
            },
        });

        return () => unsubcribe();
    }, []);

    if (!servers || servers?.length === 0) return <SidebarAddServerIcon />;
    if (!serverId) return <Navigate to={`/servers/${servers[0].id}`} />;

    return (
        <Stack direction="column" className="p-4" gap={1}>
            <Stack direction="column">
                {servers.map((server: Server, i: number) => (
                    <ServerListItem server={server} key={i} />
                ))}
            </Stack>
            <SidebarAddServerIcon />
        </Stack>
    );
};

export default SidebarServers;
