import { Navigate, useParams } from "react-router-dom";
import ChannelHeader from "../components/channels/ChannelHeader";
import ChannelMessages from "../components/channels/ChannelMessages";
import ChannelTextInput from "../../shared/components/ChannelTextInput";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import { useQuery } from "@tanstack/react-query";
import { api, socket } from "@/api";
import { useEffect } from "react";

const ChannelPage = () => {
    const { serverId, channelId } = useParams();

    const { isLoading, data: channel } = useQuery({
        queryKey: ["getChannel", { id: channelId }],
        queryFn: () =>
            api
                .get(`/channels/${serverId}/${channelId}`)
                .then((res) => res.data),
    });

    useEffect(() => {
        socket.emit("server:focus", serverId);
        socket.emit("channel:join", channelId);
    }, [channelId]);

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
