import SidebarAddServerIcon from "./SidebarAddServerIcon";
import { Navigate, useParams } from "react-router-dom";
import ServerListItem from "./ServerListItem";
import { Server } from "@furxus/types";
import Stack from "@mui/material/Stack";
import { useUserServers } from "@/hooks";

const SidebarServers = () => {
    const { serverId } = useParams();

    const { servers } = useUserServers();

    if (!servers || servers?.length === 0) return <SidebarAddServerIcon />;
    if (!serverId) return <Navigate to={`/servers/${servers[0].id}`} />;

    return (
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap={1}
        >
            {servers?.map((server: Server, i: number) => (
                <ServerListItem server={server} key={i} />
            ))}
            <SidebarAddServerIcon />
        </Stack>
    );
};

export default SidebarServers;
