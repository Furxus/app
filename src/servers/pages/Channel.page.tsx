import { Navigate, useParams } from "react-router-dom";
import ChannelHeader from "../components/channels/ChannelHeader";
import ChannelMessages from "../components/channels/ChannelMessages";
import ChannelTextInput from "../../shared/components/ChannelTextInput";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, socket } from "@/api";
import { useEffect } from "react";
import { Message } from "@furxus/types";

const ChannelPage = () => {
    const queryClient = useQueryClient();
    const { serverId, channelId } = useParams();

    const { isLoading, data: channel } = useQuery({
        queryKey: ["getChannel", { id: channelId }],
        queryFn: () =>
            api
                .get(`/channels/${serverId}/${channelId}`)
                .then((res) => res.data),
    });

    useEffect(() => {
        socket.emit("channel:join", channelId);

        socket.on("message:create", (message: Message) => {
            queryClient.setQueryData(
                ["getMessages", { channelId }],
                (data: Message[]) => [...data, message]
            );
        });

        socket.on("message:delete", (message: Message) => {
            queryClient.setQueryData(
                ["getMessages", { channelId }],
                (data: Message[]) =>
                    data.filter((m: Message) => m.id !== message.id)
            );
        });

        socket.on("message:update", (message: Message) => {
            queryClient.setQueryData(
                ["getMessages", { channelId }],
                (data: Message[]) =>
                    data.map((m: Message) =>
                        m.id === message.id ? message : m
                    )
            );
        });

        return () => {
            socket.emit("channel:leave", channelId);
            socket.off("message:create");
            socket.off("message:update");
            socket.off("message:delete");
        };
    }, []);

    if (isLoading || !channelId) return <Skeleton />;
    if (!channel) return <Navigate to={`/servers/${serverId}`} />;

    return (
        <Stack direction="column" className="w-full h-full overflow-x-hidden">
            <ChannelHeader channel={channel} />
            <ChannelMessages channelId={channelId} />
            <ChannelTextInput channel={channel} />
        </Stack>
    );
};

export default ChannelPage;
