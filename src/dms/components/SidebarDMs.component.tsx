import { Stack } from "@mui/material";
import { Navigate, useParams } from "react-router-dom";
import DMChannelItem from "./DMChannelItem";
import { DMChannel } from "@furxus/types";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";

const SidebarDMs = () => {
    const { channelId } = useParams();

    const { isLoading, data: dms } = useQuery({
        queryKey: ["getDMs"],
        queryFn: () => api.get("/@me/dms").then((res) => res.data),
    });

    if (isLoading) return <></>;
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
