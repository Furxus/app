import { Navigate, useParams } from "react-router-dom";
import ChannelHeader from "../components/channels/ChannelHeader";
import ChannelMessages from "../components/channels/ChannelMessages";
import ChannelTextInput from "../../shared/components/ChannelTextInput";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";

const ChannelPage = () => {
    const { serverId, channelId } = useParams();

    const { isLoading, data: channel } = useQuery({
        queryKey: ["getChannel", { serverId, id: channelId }],
        queryFn: () =>
            api
                .get(`/servers/${serverId}/channels/${channelId}`)
                .then((res) => res.data),
    });

    if (!serverId) return <></>;
    if (!channelId) return <></>;
    if (isLoading) return <Skeleton />;
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
