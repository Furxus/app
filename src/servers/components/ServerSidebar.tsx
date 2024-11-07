import { Navigate, useParams } from "react-router-dom";
import SidebarChannels from "./channels/SidebarChannels";
import { Server } from "@furxus/types";
import Stack from "@mui/material/Stack";
import SidebarProfile from "./SidebarProfile";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";

const ServerSidebar = ({ server }: { server: Server }) => {
    const { channelId } = useParams();

    const { data: channels } = useQuery({
        queryKey: ["getChannels", { serverId: server.id }],
        queryFn: () =>
            api.get(`/channels/${server.id}`).then((res) => res.data),
    });

    if (!channelId && channels?.length > 0)
        return <Navigate to={`/servers/${server.id}/${channels[0].id}`} />;

    return (
        <Stack
            pt={1}
            justifyContent="flex-start"
            alignItems="flex-start"
            className="shadow-md h-dvh border-r w-60 border-green-500/60 bg-neutral-700/[.2]"
        >
            <div className="flex shadow-2xl border-green-500/60 border-b bg-neutral-800[0.5] px-3 py-3 w-full">
                <span className="text-neutral-200 text-md truncate">
                    {server.name}
                </span>
            </div>
            <SidebarChannels server={server} channels={channels} />
            <SidebarProfile />
        </Stack>
    );
};

export default ServerSidebar;
