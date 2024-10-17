import { getDMs } from "@/gql/dms";
import { useQuery } from "@apollo/client";
import { Stack } from "@mui/material";
import { Navigate, useParams } from "react-router-dom";
import DMChannelItem from "./DMChannelItem";

const SidebarDMs = () => {
    const { dmId } = useParams();

    const { loading, data: { getDMs: dms } = {} } = useQuery(getDMs);

    if (loading) return <></>;
    if (!dmId) {
        if (dms[0]) return <Navigate to={`/dms/${dms[0].id}`} />;
        return <></>;
    }

    return (
        <Stack
            className="py-6 px-1 w-full h-full shadow-2xl bg-neutral-700[.4]"
            alignItems="center"
            gap={1}
        >
            {dms.map((dm: any) => (
                <DMChannelItem key={dm.id} channel={dm} />
            ))}
        </Stack>
    );
};

export default SidebarDMs;
