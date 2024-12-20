import Stack from "@mui/material/Stack";
import { Navigate, useParams } from "react-router-dom";
import DMChannelItem from "./DMChannelItem.component";
import { DMChannel } from "@furxus/types";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { Virtuoso } from "react-virtuoso";
import SidebarProfile from "@/servers/components/SidebarProfile.component";

const SidebarDMs = () => {
    const { dmId } = useParams();

    const { data: dms } = useQuery<DMChannel[]>({
        queryKey: ["getDMs"],
        queryFn: () => api.get("/@me/dms").then((res) => res.data),
    });

    if (!dms) return <></>;
    if (!dmId) {
        if (dms[0]) return <Navigate to={`/dms/${dms[0].id}`} />;
        return <></>;
    }

    return (
        <Stack
            pt={1}
            justifyContent="flex-start"
            alignItems="flex-start"
            className="shadow-md w-60 h-full bg-neutral-700/[.2] border-r border-[#367588]/60"
        >
            <Stack
                direction="column"
                className="w-full border-b border-[#367588]/60"
            >
                <Stack className="shadow-2xl bg-neutral-800[0.5] px-3 py-3 w-full">
                    <span className="text-neutral-200 text-md truncate">
                        Direct Messages
                    </span>
                </Stack>
            </Stack>
            <Stack className="h-full w-full p-2">
                <Virtuoso
                    data={dms}
                    itemContent={(index, dm) => (
                        <DMChannelItem key={index} channel={dm} />
                    )}
                    className="w-full"
                />
            </Stack>
            <SidebarProfile />
        </Stack>
    );
};

export default SidebarDMs;
