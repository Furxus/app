import { getDM } from "@/gql/dms";
import { useQuery } from "@apollo/client";
import { Stack } from "@mui/material";
import { useParams } from "react-router-dom";

import DMHeader from "./components/DMHeader";
import DMTextInput from "./components/DMTextInput";
import ChannelMessages from "@/servers/components/channels/ChannelMessages";
import { useAuth } from "@/hooks";
import { User } from "@furxus/types";

const DMsChannelPage = () => {
    const { user: auth } = useAuth();
    const { dmId } = useParams();

    const { data: { getDM: dmChannel } = {} } = useQuery(getDM, {
        variables: {
            id: dmId,
        },
    });

    if (!dmId) return <></>;
    if (!dmChannel) return <></>;

    const recipient: User =
        dmChannel.recipient1?.id === auth.id
            ? dmChannel.recipient2
            : dmChannel.recipient1;

    return (
        <Stack direction="column" className="w-full h-full overflow-x-hidden">
            <DMHeader recipient={recipient} />
            <ChannelMessages channelId={dmId} />
            <DMTextInput recipient={recipient} channel={dmChannel} />
        </Stack>
    );
};

export default DMsChannelPage;
