import { api } from "@/api";
import { useAppMode, useAuth } from "@/hooks";
import { DMChannel, User } from "@furxus/types";
import { ButtonProps, IconButton } from "@mui/material";
import Avatar, { AvatarProps } from "@mui/material/Avatar";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { Item, Menu, useContextMenu } from "react-contexify";
import { FaUserCircle, FaUserMinus, FaUserPlus } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useHover } from "usehooks-ts";
import { DNDBadge, IdleBadge, OfflineBadge, OnlineBadge } from "../Badges";

const UserAvatar = ({
    avatar,
    button,
    user,
    withBadge = false,
}: {
    user: User;
    avatar?: { avatarProps?: AvatarProps; avatarClasses?: string };
    button?: { btnProps?: ButtonProps; btnClasses?: string };
    withBadge?: boolean;
}) => {
    const navigate = useNavigate();
    const { appMode, changeAppMode } = useAppMode();
    const { avatarProps, avatarClasses } = avatar ?? {};
    const { btnProps, btnClasses } = button ?? {};
    const { user: auth }: { user: any } = useAuth();

    const { mutate: sendFriendRequest } = useMutation({
        mutationKey: ["sendFriendRequest"],
        mutationFn: (userId: string) => api.put("/friend-requests", { userId }),
    });

    const { mutate: deleteFriendRequest } = useMutation({
        mutationKey: ["deleteFriendRequest"],
        mutationFn: (userId: string) =>
            api.delete(`/friend-requests/${userId}`),
    });

    const { mutate: acceptFriendRequest } = useMutation({
        mutationKey: ["acceptFriendRequest"],
        mutationFn: (userId: string) => api.put(`/friends`, { userId }),
    });

    const { mutate: removeFriend } = useMutation({
        mutationKey: ["removeFriend"],
        mutationFn: (userId: string) => api.delete(`/friends/${userId}`),
    });

    const { mutate: openDM } = useMutation({
        mutationKey: ["openDM"],
        mutationFn: (recipient: string) =>
            api.post("/dms", { recipient }).then((res) => res.data),
        onSuccess: (dm: DMChannel) => {
            changeAppMode("dms");
            navigate(`/dms/${dm.id}`);
        },
    });

    const hoverRef = useRef<HTMLDivElement>(null);
    const isHovered = useHover(hoverRef);

    const { show } = useContextMenu();

    const showUserMenu = (event: any) => {
        event.stopPropagation();
        show({
            id: `avatar-menu-${user?.id}`,
            event: event,
        });
    };

    const renderAvatar = () => {
        if (!isHovered) {
            return (
                <Avatar
                    src={user?.avatar ?? user?.defaultAvatar}
                    alt={user?.username}
                    className={avatarClasses}
                    sx={{
                        width: "2.5rem",
                        height: "2.5rem",
                    }}
                    {...avatarProps}
                />
            );
        } else {
            return (
                <Avatar
                    src={user?.avatar ?? user?.defaultAvatar}
                    alt={user?.username}
                    className={avatarClasses}
                    sx={{
                        width: "2.5rem",
                        height: "2.5rem",
                    }}
                    {...avatarProps}
                />
            );
        }
    };

    const renderBadgeAndAvatar = () => {
        switch (user?.activity.status) {
            case "online":
                return (
                    <OnlineBadge
                        overlap="circular"
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        variant="dot"
                    >
                        {renderAvatar()}
                    </OnlineBadge>
                );
            case "offline":
                return (
                    <OfflineBadge
                        overlap="circular"
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        variant="dot"
                    >
                        {renderAvatar()}
                    </OfflineBadge>
                );
            case "idle":
                return (
                    <IdleBadge
                        overlap="circular"
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        variant="dot"
                    >
                        {renderAvatar()}
                    </IdleBadge>
                );
            case "dnd":
                return (
                    <DNDBadge
                        overlap="circular"
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        variant="dot"
                    >
                        {renderAvatar()}
                    </DNDBadge>
                );
            default:
                return <></>;
        }
    };

    return (
        <>
            <IconButton
                onContextMenu={showUserMenu}
                className={btnClasses}
                {...btnProps}
            >
                {withBadge ? renderBadgeAndAvatar() : renderAvatar()}
            </IconButton>
            <Menu id={`avatar-menu-${user?.id}`}>
                <Item>
                    <FaUserCircle className="mr-2" />
                    View Profile
                </Item>
                {auth?.id !== user?.id && (
                    <>
                        {appMode !== "dms" && (
                            <Item onClick={() => openDM(user.id)}>
                                <MdMail className="mr-2" />
                                Message
                            </Item>
                        )}
                        {auth.friends?.some((f: string) => f === user?.id) && (
                            <Item onClick={() => removeFriend(user.id)}>
                                <FaUserMinus className="mr-2" />
                                Remove Friend
                            </Item>
                        )}
                        {auth.friendRequests?.sent.some(
                            (f: string) => f === user?.id
                        ) && (
                            <Item onClick={() => deleteFriendRequest(user.id)}>
                                <FaUserMinus className="mr-2" />
                                Cancel Friend Request
                            </Item>
                        )}
                        {auth.friendRequests?.received.some(
                            (f: string) => f === user?.id
                        ) && (
                            <Item onClick={() => acceptFriendRequest(user.id)}>
                                <FaUserMinus className="mr-2" />
                                Accept Request
                            </Item>
                        )}
                        {!auth.friendRequests?.sent.some(
                            (f: string) => f === user?.id
                        ) &&
                            !auth.friendRequests?.received.some(
                                (f: string) => f === user?.id
                            ) &&
                            !auth.friends?.some(
                                (f: string) => f === user?.id
                            ) && (
                                <Item
                                    onClick={() => sendFriendRequest(user.id)}
                                >
                                    <FaUserPlus className="mr-2" />
                                    Send Friend Request
                                </Item>
                            )}
                    </>
                )}
            </Menu>
        </>
    );
};

export default UserAvatar;
