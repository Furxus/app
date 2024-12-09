import {  useAuth } from "@hooks";
import { FaCogs } from "react-icons/fa";
import { Item, Menu, useContextMenu } from "react-contexify";
import { MouseEvent, useState } from "react";

import ProfileSettings from "@/shared/components/user/UserProfileSettings.component";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@/shared/components/Tooltip";
import UserAvatar from "@/shared/components/avatar/UserAvatar.component";
import classNames from "classnames";
import { Divider } from "@mui/material";
import { useAppStore } from "@/hooks/useAppStore";

const SidebarProfile = () => {
    const { appMode } = useAppStore();
    const { user, logout } = useAuth();
    const [modalOpen, setModalOpen] = useState(false);

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
                className={classNames(
                    "text-ellipsis px-2 w-full h-[5.65rem] border-t",
                    {
                        "border-green-500/60": appMode.current === "servers",
                        "border-[#367588]/60": appMode.current === "dms",
                    }
                )}
            >
                <UserAvatar
                    button={{
                        btnProps: {
                            sx: {
                                width: "2.5rem",
                                height: "2.5rem",
                            },
                        },
                    }}
                    user={user}
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
                    <Tooltip
                        arrow
                        title={<Typography>User Settings</Typography>}
                    >
                        <IconButton
                            onContextMenu={showMenu}
                            onClick={() => setModalOpen(true)}
                            size="small"
                            className="hover:animate-pulse"
                        >
                            <FaCogs />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>
            <ProfileSettings open={modalOpen} setOpen={setModalOpen} />
            <Menu id="sidebar-profile-menu">
                <Item onClick={() => setModalOpen(true)}>Settings</Item>
                <Divider />
                <Item onClick={() => logout()}>Logout</Item>
            </Menu>
        </>
    );
};

export default SidebarProfile;
