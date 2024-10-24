import { Navigate, useParams } from "react-router-dom";
import ChannelHeader from "../components/channels/ChannelHeader";
import { useQuery } from "@apollo/client";
import { GetChannel } from "@gql/channels";
import ChannelMessages from "../components/channels/ChannelMessages";
import ChannelTextInput from "../components/channels/ChannelTextInput";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

const ChannelPage = () => {
    const { serverId, channelId } = useParams();

    const { loading, data: { getChannel: channel } = {} } = useQuery(
        GetChannel,
        {
            variables: {
                serverId,
                id: channelId,
            },
        }
    );

    if (!serverId) return <></>;
    if (!channelId) return <></>;
    if (loading) return <Skeleton />;
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
