import { Stack } from "@mui/material";
import { useParams } from "react-router-dom";

import DMHeader from "./components/DMHeader";
import DMTextInput from "./components/DMTextInput";
import ChannelMessages from "@/servers/components/channels/ChannelMessages";
import { useAuth } from "@/hooks";
import { DMChannel, User } from "@furxus/types";
import { useState } from "react";

const DMsChannelPage = () => {
    const { user: auth } = useAuth();
    const { channelId } = useParams();
    const [dmChannel] = useState<DMChannel | null>(null);

    // const { data: { getDM: dmChannel } = {} } = useQuery(getDM, {
    //     variables: {
    //         id: channelId,
    //     },
    // });

    if (!channelId) return <></>;
    if (!dmChannel) return <></>;

    const recipient: User =
        dmChannel.recipient1?.id === auth.id
            ? dmChannel.recipient2
            : dmChannel.recipient1;

    return (
        <Stack direction="column" className="w-full h-full overflow-x-hidden">
            <DMHeader recipient={recipient} />
            <ChannelMessages channelId={channelId} />
            <DMTextInput recipient={recipient} channel={dmChannel} />
        </Stack>
    );
};

export default DMsChannelPage;
