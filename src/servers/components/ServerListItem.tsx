import { useState } from "react";
import ServerInvitesDialog from "./ServerInvitesDialog";
import { useAuth } from "@hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { LeaveServer } from "@gql/servers";
import { useMutation } from "@apollo/client";
import { ActiveServerPill, HoverServerPill } from "./ServerPills";
import ConfirmServerDeleteDialog from "./ConfirmServerDeleteDialog";
import { Server } from "@furxus/types";
import { FaMailBulk, FaSignOutAlt, FaTrash } from "react-icons/fa";
import { Menu, useContextMenu, Item } from "react-contexify";
import Stack from "@mui/material/Stack";
import Avatar from "@/shared/components/avatar/Avatar";
import MAvatar from "@mui/material/Avatar";

const ServerListItem = ({ server }: { server: Server }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = location.pathname.includes(server.id);

    const [hover, setHover] = useState(false);
    const [invitesDialogVisible, setInvitesDialogVisible] = useState(false);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

    // const [leaveServer] = useMutation(LeaveServer, {
    //     onCompleted: () => {
    //         navigate("/servers");
    //     },
    //     variables: {
    //         id: server.id,
    //     },
    // });

    const { show } = useContextMenu();

    // Keep this for now since they are no permission system created
    const showMenu = (event: any) => {
        event.stopPropagation();
        show({
            id: `server-menu-${server.id}`,
            event,
        });
    };
    1;

    const navigateToServer = () => {
        if (isActive) return;
        navigate(`/servers/${server.id}`);
    };

    return (
        <Stack justifyContent="center" position="relative">
            {isActive && <ActiveServerPill />}
            {hover && !isActive && <HoverServerPill />}
            {server.icon ? (
                <Avatar
                    server={server}
                    onClick={navigateToServer}
                    className="cursor-pointer hover:rounded-3xl"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    onContextMenu={showMenu}
                    sx={{
                        width: 56,
                        height: 56,
                        bgcolor: "transparent",
                    }}
                >
                    {server.nameAcronym}
                </Avatar>
            ) : (
                <MAvatar
                    onClick={navigateToServer}
                    className="cursor-pointer hover:rounded-3xl bg-neutral-700"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    onContextMenu={showMenu}
                    sx={{
                        width: 56,
                        height: 56,
                        bgcolor: "transparent",
                    }}
                >
                    <span className="font-semibold">{server.nameAcronym}</span>
                </MAvatar>
            )}
            <Menu id={`server-menu-${server.id}`}>
                {user?.id === server.owner?.id && (
                    <Item onClick={() => setInvitesDialogVisible(true)}>
                        <FaMailBulk className="mr-2" />
                        Server Invites
                    </Item>
                )}
                {user?.id === server.owner?.id ? (
                    <Item onClick={() => setConfirmDeleteVisible(true)}>
                        <FaTrash className="mr-2" />
                        Delete Server
                    </Item>
                ) : (
                    <Item /*onClick={() => leaveServer()}*/>
                        <FaSignOutAlt className="mr-2" />
                        Leave Server
                    </Item>
                )}
            </Menu>
            {invitesDialogVisible && (
                <ServerInvitesDialog
                    server={server}
                    visible={invitesDialogVisible}
                    setVisible={setInvitesDialogVisible}
                />
            )}
            {confirmDeleteVisible && (
                <ConfirmServerDeleteDialog
                    server={server}
                    visible={confirmDeleteVisible}
                    setVisible={setConfirmDeleteVisible}
                />
            )}
        </Stack>
    );
};

export default ServerListItem;
