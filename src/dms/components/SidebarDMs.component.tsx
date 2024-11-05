import { Stack } from "@mui/material";
import { Navigate, useParams } from "react-router-dom";
import DMChannelItem from "./DMChannelItem";
import { DMChannel } from "@furxus/types";
import { useState } from "react";

const SidebarDMs = () => {
    const { channelId } = useParams();
    const [dms] = useState<DMChannel[]>([]);

    //const { loading, data: { getDMs: dms } = {} } = useQuery(getDMs);

    //if (loading) return <></>;
    if (!channelId) {
        if (dms[0]) return <Navigate to={`/dms/${dms[0].id}`} />;
        return <></>;
    }

    return (
        <Stack className="py-6 px-1 w-full h-full shadow-2xl" gap={1}>
            {dms?.map((dm: DMChannel) => (
                <DMChannelItem key={dm.id} channel={dm} />
            ))}
        </Stack>
    );
};

export default SidebarDMs;
