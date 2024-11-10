import SidebarAddServerIcon from "./SidebarAddServerIcon.component";

import ServerListItem from "./ServerListItem.component";
import { Server } from "@furxus/types";
import Stack from "@mui/material/Stack";
import { useUserServers } from "@/hooks";

const SidebarServers = () => {
    const { servers } = useUserServers();

    if (!servers || servers?.length === 0) return <SidebarAddServerIcon />;

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
