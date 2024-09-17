import { Avatar, IconButton, Stack, Typography } from "@mui/material";
import { useAuth } from "@hooks";
import { FaCogs } from "react-icons/fa";
import { Item, Menu, useContextMenu } from "react-contexify";
import { MouseEvent } from "react";

const SidebarProfile = () => {
    const { user, logout } = useAuth();

    const { show } = useContextMenu();

    const showMenu = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        show({
            id: "sidebar-profile-menu",
            event,
            position: {
                x: event.clientX,
                y: event.clientY - 50,
            },
        });
    };

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                gap={0.5}
                className="text-ellipsis px-2 w-full h-[5.65rem] border-t border-green-500/60"
            >
                <Avatar
                    src={user.avatar ?? user.defaultAvatar}
                    sx={{ width: 36, height: 36 }}
                />
                <Stack direction="column" className="w-full">
                    <Typography variant="body1" className="truncate">
                        {user.displayName ?? user.username}
                    </Typography>
                    <Typography variant="caption" className="truncate">
                        Status here
                    </Typography>
                </Stack>
                <Stack
                    direction="row"
                    className=" w-full"
                    justifyContent="flex-end"
                >
                    <IconButton
                        onContextMenu={showMenu}
                        size="small"
                        className="hover:animate-pulse"
                    >
                        <FaCogs />
                    </IconButton>
                </Stack>
            </Stack>
            <Menu id="sidebar-profile-menu">
                <Item onClick={() => logout()}>Logout</Item>
            </Menu>
        </>
    );
};

export default SidebarProfile;
