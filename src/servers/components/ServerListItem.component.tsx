import { useState } from "react";
import ServerInvitesDialog from "./ServerInvitesModal.component";
import { useAuth } from "@hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { ActiveServerPill, HoverServerPill } from "./ServerPills.component";
import ConfirmServerDeleteDialog from "./ConfirmServerDeleteModal.component";
import { Server } from "@furxus/types";
import { FaMailBulk, FaSignOutAlt, FaTrash } from "react-icons/fa";
import { Menu, useContextMenu, Item } from "react-contexify";
import Stack from "@mui/material/Stack";
import Avatar from "@/shared/components/avatar/Avatar.component";
import MAvatar from "@mui/material/Avatar";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import { Tooltip, Typography } from "@mui/material";

const ServerListItem = ({ server }: { server: Server }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = location.pathname.includes(server.id);

    const [hover, setHover] = useState(false);
    const [invitesDialogVisible, setInvitesDialogVisible] = useState(false);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

    const { mutate: leaveServer } = useMutation({
        mutationKey: ["leaveServer", { id: server.id }],
        mutationFn: () =>
            api
                .delete(`/servers/${server.id}/members/${user?.id}`)
                .then((res) => res.data),
    });

    const { show } = useContextMenu();

    // Keep this for now since they are no permission system created
    const showMenu = (event: any) => {
        event.stopPropagation();
        show({
            id: `server-menu-${server.id}`,
            event,
        });
    };

    const navigateToServer = () => {
        if (isActive) return;
        navigate(`/servers/${server.id}`);
    };

    return (
        <Stack justifyContent="center" position="relative">
            {isActive && <ActiveServerPill />}
            {hover && !isActive && <HoverServerPill />}
            <Tooltip
                title={
                    <Typography variant="body2" className="text-white">
                        {server.name}
                    </Typography>
                }
                arrow
                placement="right"
            >
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
                        <span className="font-semibold">
                            {server.nameAcronym}
                        </span>
                    </MAvatar>
                )}
            </Tooltip>
            <Menu id={`server-menu-${server.id}`}>
                {user?.id === server.owner.id && (
                    <Item onClick={() => setInvitesDialogVisible(true)}>
                        <FaMailBulk className="mr-2" />
                        Server Invites
                    </Item>
                )}
                {user?.id === server.owner.id ? (
                    <Item onClick={() => setConfirmDeleteVisible(true)}>
                        <FaTrash className="mr-2" />
                        Delete Server
                    </Item>
                ) : (
                    <Item onClick={() => leaveServer()}>
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
