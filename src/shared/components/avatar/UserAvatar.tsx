import { api, socket } from "@/api";
import { useAppMode, useAuth } from "@/hooks";
import { DMChannel, User } from "@furxus/types";
import { Alert, ButtonProps, IconButton, Snackbar } from "@mui/material";
import Avatar, { AvatarProps } from "@mui/material/Avatar";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Item, Menu, useContextMenu } from "react-contexify";
import { FaUserCircle, FaUserMinus, FaUserPlus } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useHover } from "usehooks-ts";

const UserAvatar = ({
    avatar,
    button,
    user,
}: {
    user: User;
    avatar?: { avatarProps?: AvatarProps; avatarClasses?: string };
    button?: { btnProps?: ButtonProps; btnClasses?: string };
}) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { changeAppMode } = useAppMode();
    const { avatarProps, avatarClasses } = avatar ?? {};
    const { btnProps, btnClasses } = button ?? {};
    const { user: auth } = useAuth();

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { mutate: sendFriendRequest } = useMutation({
        mutationKey: ["sendFriendRequest"],
        mutationFn: (userId: string) => api.put("/friend-requests", { userId }),
        onSuccess: () => {
            setMessage("Friend request sent");
            setSnackbarVisible(true);
        },
        onError: (err: any) => {
            setError(err.response.data.message);
            setSnackbarVisible(true);
        },
    });

    const { mutate: cancelFriendRequest } = useMutation({
        mutationKey: ["cancelFriendRequest"],
        mutationFn: (userId: string) =>
            api.delete(`/friend-requests`, {
                params: { userId },
            }),
        onSuccess: () => {
            setMessage("Friend request cancelled");
            setSnackbarVisible(true);
        },
    });

    const { mutate: acceptFriendRequest } = useMutation({
        mutationKey: ["acceptFriendRequest"],
        mutationFn: (userId: string) => api.put(`/friends`, { userId }),
        onSuccess: () => {
            setMessage("Friend request accepted");
            setSnackbarVisible(true);
        },
    });

    const { mutate: removeFriend } = useMutation({
        mutationKey: ["removeFriend"],
        mutationFn: (userId: string) =>
            api.delete(`/friends`, {
                params: { userId },
            }),
        onSuccess: () => {
            setMessage("Friend removed");
            setSnackbarVisible(true);
        },
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

    // const [sendFriendRequest] = useMutation(SendFriendRequest, {
    //     variables: { userId: user?.id },
    //     onCompleted: (data) => {
    //         if (!data.sendFriendRequest) return;
    //         setMessage("Friend request sent");
    //         setSnackbarVisible(true);
    //     },
    //     onError: (err) => {
    //         setSnackbarVisible(true);
    //         setError(err.message);
    //     },
    // });

    // const [cancelFriendRequest] = useMutation(CancelFriendRequest, {
    //     variables: {
    //         userId: user?.id,
    //     },
    //     onCompleted: (data) => {
    //         if (!data.cancelFriendRequest) return;
    //         setMessage("Friend request cancelled");
    //         setError(null);
    //         setSnackbarVisible(true);
    //     },
    //     onError: (err) => {
    //         setError(err.message);
    //         setMessage(null);
    //         setSnackbarVisible(true);
    //     },
    // });

    // const [acceptFriendRequest] = useMutation(AcceptFriendRequest, {
    //     variables: {
    //         userId: user?.id,
    //     },
    //     onCompleted: (data) => {
    //         if (!data.acceptFriendRequest) return;
    //         setMessage("Friend request accepted");
    //         setError(null);
    //         setSnackbarVisible(true);
    //     },
    //     onError: (err) => {
    //         setError(err.message);
    //         setMessage(null);
    //         setSnackbarVisible(true);
    //     },
    // });

    // const [removeFriend] = useMutation(RemoveFriend, {
    //     variables: {
    //         userId: user?.id,
    //     },
    //     onCompleted: (data) => {
    //         if (!data.removeFriend) return;
    //         setMessage("Friend removed");
    //         setError(null);
    //         setSnackbarVisible(true);
    //     },
    //     onError: (err) => {
    //         setError(err.message);
    //         setMessage(null);
    //         setSnackbarVisible(true);
    //     },
    // });

    // const [openDM] = useMutation(OpenDMChannel, {
    //     variables: {
    //         recipient: user?.id,
    //     },
    //     onCompleted: ({ openDMChannel }) => {
    //         if (!openDMChannel) return;
    //         changeAppMode("dms");
    //         navigate(`/dms/${openDMChannel.id}`);
    //     },
    //     onError: (err) => {
    //         console.error(err);
    //     },
    // });

    const hoverRef = useRef<HTMLDivElement>(null);
    const isHovered = useHover(hoverRef);

    const { show } = useContextMenu();

    const onClose = () => {
        setSnackbarVisible(false);
        setTimeout(() => {
            setMessage(null);
            setError(null);
        }, 1000);
    };

    const showUserMenu = (event: any) => {
        event.stopPropagation();
        show({
            id: `avatar-menu-${user?.id}`,
            event: event,
        });
    };

    return (
        <>
            <IconButton className={btnClasses} {...btnProps}>
                {!isHovered ? (
                    <Avatar
                        ref={hoverRef}
                        src={
                            user?.avatar
                                ?.replaceAll("gif", "png")
                                .replaceAll("a_", "") ?? user?.defaultAvatar
                        }
                        alt={user?.username}
                        className={avatarClasses}
                        onContextMenu={showUserMenu}
                        sx={{
                            width: "2.5rem",
                            height: "2.5rem",
                        }}
                        {...avatarProps}
                    />
                ) : (
                    <Avatar
                        ref={hoverRef}
                        src={user?.avatar ?? user?.defaultAvatar}
                        alt={user?.username}
                        className={avatarClasses}
                        onContextMenu={showUserMenu}
                        sx={{
                            width: "2.5rem",
                            height: "2.5rem",
                        }}
                        {...avatarProps}
                    />
                )}
            </IconButton>
            <Menu id={`avatar-menu-${user?.id}`}>
                <Item>
                    <FaUserCircle className="mr-2" />
                    View Profile
                </Item>
                {auth?.id !== user?.id && (
                    <>
                        <Item onClick={() => openDM(user.id)}>
                            <MdMail className="mr-2" />
                            Message
                        </Item>
                        {auth.friends?.some((f) => f.id === user?.id) && (
                            <Item onClick={() => removeFriend(user.id)}>
                                <FaUserMinus className="mr-2" />
                                Remove Friend
                            </Item>
                        )}
                        {auth.friendRequests?.sent.some(
                            (f) => f.id === user?.id
                        ) && (
                            <Item onClick={() => cancelFriendRequest(user.id)}>
                                <FaUserMinus className="mr-2" />
                                Cancel Request
                            </Item>
                        )}
                        {auth.friendRequests?.received.some(
                            (f) => f.id === user?.id
                        ) && (
                            <Item onClick={() => acceptFriendRequest(user.id)}>
                                <FaUserMinus className="mr-2" />
                                Accept Request
                            </Item>
                        )}
                        {!auth.friendRequests?.sent.some(
                            (f) => f.id === user?.id
                        ) &&
                            !auth.friendRequests?.received.some(
                                (f) => f.id === user?.id
                            ) &&
                            !auth.friends?.some((f) => f.id === user?.id) && (
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
            <Snackbar
                open={snackbarVisible}
                onClose={onClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                autoHideDuration={6000}
            >
                <Alert severity={error ? "error" : "success"} onClose={onClose}>
                    {error ?? message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default UserAvatar;
