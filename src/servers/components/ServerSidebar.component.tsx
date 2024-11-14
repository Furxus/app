import SidebarChannels from "./channels/SidebarChannels.component";
import { BaseServerChannel, Server } from "@furxus/types";
import Stack from "@mui/material/Stack";
import SidebarProfile from "./SidebarProfile.component";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const ServerSidebar = ({ server }: { server: Server }) => {
    const navigate = useNavigate();
    const { channelId } = useParams();

    const { data: channels } = useQuery<BaseServerChannel[]>({
        queryKey: ["getChannels", { serverId: server.id }],
        queryFn: () =>
            api
                .get(`/channels/${server.id}`, {
                    params: { populate: ["voiceStates"] },
                })
                .then((res) => res.data),
    });

    useEffect(() => {
        if (channels && channels.length > 0 && !channelId)
            navigate(`/servers/${server.id}/${channels[0].id}`);
    }, []);

    if (!channels) return <></>;

    return (
        <Stack
            pt={1}
            justifyContent="flex-start"
            alignItems="flex-start"
            className="shadow-md border-r h-full w-60 border-green-500/60 bg-neutral-700/[.2]"
        >
            <Stack className="shadow-2xl border-green-500/60 border-b bg-neutral-800[0.5] px-3 py-3 w-full">
                <span className="text-neutral-200 text-md truncate">
                    {server.name}
                </span>
            </Stack>
            <SidebarChannels server={server} channels={channels} />
            <SidebarProfile />
        </Stack>
    );
};

export default ServerSidebar;
