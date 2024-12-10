import { useParams } from "react-router-dom";
import ChannelHeader from "../components/channels/ChannelHeader.component";
import ChannelMessages from "../components/channels/ChannelMessages.component";
import ChannelTextInput from "../../shared/components/MessageTextInput.component";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, socket } from "@/api";
import { useEffect } from "react";
import { Message } from "@furxus/types";
import { observer } from "mobx-react-lite";
import { useAppStore } from "@/hooks/useAppStore";

const ChannelPage = () => {
    const app = useAppStore();
    const queryClient = useQueryClient();
    const { serverId, channelId } = useParams();

    const { data: channel } = useQuery({
        queryKey: ["getChannel", { id: channelId }],
        queryFn: () =>
            api
                .get(`/channels/${serverId}/${channelId}`)
                .then((res) => res.data),
    });

    useEffect(() => {
        if (channel) {
            app.channels.set(channel);
        }
    }, [channel]);

    useEffect(() => {
        socket.emit("channel:join", channelId);

        socket.on("message:create", (message: Message) => {
            queryClient.setQueryData(
                ["getMessages", { channelId }],
                (data: any) => ({
                    pages: [[...data.pages?.flat(), message]],
                    pageParams: data.pageParams,
                })
            );
        });

        socket.on("message:delete", (message: Message) => {
            queryClient.setQueryData(
                ["getMessages", { channelId }],
                (data: any) => ({
                    pages: [
                        data.pages
                            ?.flat()
                            .filter((m: Message) => m.id !== message.id),
                    ],
                    pageParams: data.pageParams,
                })
            );
        });

        socket.on("message:update", (message: Message) => {
            queryClient.setQueryData(
                ["getMessages", { channelId }],
                (data: any) => ({
                    pages: [
                        data.pages
                            ?.flat()
                            .map((m: Message) =>
                                m.id === message.id ? message : m
                            ),
                    ],
                    pageParams: data.pageParams,
                })
            );
        });

        return () => {
            socket.emit("channel:leave", channelId);
            socket.off("message:create");
            socket.off("message:update");
            socket.off("message:delete");
        };
    }, []);

    if (!channelId) return <Skeleton />;
    if (!channel) return <></>;

    return (
        <Stack direction="column" className="w-full h-full overflow-x-hidden">
            <ChannelHeader channel={channel} />
            <ChannelMessages channelId={channelId} />
            <ChannelTextInput channel={channel} />
        </Stack>
    );
};

export default observer(ChannelPage);
