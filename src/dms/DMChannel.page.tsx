import Stack from "@mui/material/Stack";
import { useParams } from "react-router-dom";

import DMHeader from "./components/DMHeader.component";
import ChannelMessages from "@/servers/components/channels/ChannelMessages.component";
import { useAuth } from "@/hooks";
import { DMChannel, Message, User } from "@furxus/types";
import ChannelTextInput from "@/shared/components/MessageTextInput.component";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, socket } from "@/api";
import { useEffect } from "react";

const DMsChannelPage = () => {
    const queryClient = useQueryClient();
    const { user: auth } = useAuth();
    const { dmId } = useParams();

    const { data: dmChannel } = useQuery<DMChannel>({
        queryKey: ["getDM", { dmId }],
        queryFn: () => api.get(`/dms/${dmId}`).then((res) => res.data),
    });

    useEffect(() => {
        socket.emit("channel:join", dmId);

        socket.on("message:create", (message: Message) => {
            queryClient.setQueryData(
                ["getMessages", { channelId: dmId }],
                (data: Message[]) => [...data, message]
            );
        });

        socket.on("message:delete", (message: Message) => {
            queryClient.setQueryData(
                ["getMessages", { channelId: dmId }],
                (data: Message[]) =>
                    data.filter((m: Message) => m.id !== message.id)
            );
        });

        socket.on("message:update", (message: Message) => {
            queryClient.setQueryData(
                ["getMessages", { channelId: dmId }],
                (data: Message[]) =>
                    data.map((m: Message) =>
                        m.id === message.id ? message : m
                    )
            );
        });

        return () => {
            socket.emit("channel:leave", dmId);
            socket.off("message:create");
            socket.off("message:update");
            socket.off("message:delete");
        };
    }, []);

    if (!dmId) return <></>;
    if (!dmChannel) return <></>;

    const recipient: User =
        dmChannel.recipient1.id === auth.id
            ? dmChannel.recipient2
            : dmChannel.recipient1;

    return (
        <Stack direction="column" className="w-full h-full overflow-x-hidden">
            <DMHeader recipient={recipient} />
            <ChannelMessages channelId={dmId} />
            <ChannelTextInput recipient={recipient} channel={dmChannel} />
        </Stack>
    );
};

export default DMsChannelPage;
