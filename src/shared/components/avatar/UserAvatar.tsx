import {
    AcceptFriendRequest,
    CancelFriendRequest,
    RemoveFriend,
    SendFriendRequest,
} from "@/gql/users";
import { useAuth } from "@/hooks";
import { useMutation } from "@apollo/client";
import { User } from "@furxus/types";
import { Alert, ButtonProps, IconButton, Snackbar } from "@mui/material";
import Avatar, { AvatarProps } from "@mui/material/Avatar";
import { useRef, useState } from "react";
import { Item, Menu, useContextMenu } from "react-contexify";
import { FaUserCircle, FaUserMinus, FaUserPlus } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { useHover } from "usehooks-ts";

const UserAvatar = ({
    avatar,
    button,
    user,
}: {
    avatar?: { avatarProps?: AvatarProps; avatarClasses?: string };
    button?: { btnProps?: ButtonProps; btnClasses?: string };
    user?: User;
}) => {
    const { avatarProps, avatarClasses } = avatar ?? {};
    const { btnProps, btnClasses } = button ?? {};
    const { user: auth } = useAuth();

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [sendFriendRequest] = useMutation(SendFriendRequest, {
        variables: { userId: user?.id },
        onCompleted: (data) => {
            if (!data.sendFriendRequest) return;
            setMessage("Friend request sent");
            setSnackbarVisible(true);
        },
        onError: (err) => {
            setSnackbarVisible(true);
            setError(err.message);
        },
    });

    const [cancelFriendRequest] = useMutation(CancelFriendRequest, {
        variables: {
            userId: user?.id,
        },
        onCompleted: (data) => {
            if (!data.cancelFriendRequest) return;
            setMessage("Friend request cancelled");
            setError(null);
            setSnackbarVisible(true);
        },
        onError: (err) => {
            setError(err.message);
            setMessage(null);
            setSnackbarVisible(true);
        },
    });

    const [acceptFriendRequest] = useMutation(AcceptFriendRequest, {
        variables: {
            userId: user?.id,
        },
        onCompleted: (data) => {
            if (!data.acceptFriendRequest) return;
            setMessage("Friend request accepted");
            setError(null);
            setSnackbarVisible(true);
        },
        onError: (err) => {
            setError(err.message);
            setMessage(null);
            setSnackbarVisible(true);
        },
    });

    const [removeFriend] = useMutation(RemoveFriend, {
        variables: {
            userId: user?.id,
        },
        onCompleted: (data) => {
            if (!data.removeFriend) return;
            setMessage("Friend removed");
            setError(null);
            setSnackbarVisible(true);
        },
        onError: (err) => {
            setError(err.message);
            setMessage(null);
            setSnackbarVisible(true);
        },
    });

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
                        {...avatarProps}
                    />
                ) : (
                    <Avatar
                        ref={hoverRef}
                        src={user?.avatar ?? user?.defaultAvatar}
                        alt={user?.username}
                        className={avatarClasses}
                        onContextMenu={showUserMenu}
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
                        <Item>
                            <MdMail className="mr-2" />
                            Message
                        </Item>
                        {auth.friends?.some((f) => f.id === user?.id) && (
                            <Item onClick={() => removeFriend()}>
                                <FaUserMinus className="mr-2" />
                                Remove Friend
                            </Item>
                        )}
                        {auth.friendRequests?.sent.some(
                            (f) => f.id === user?.id
                        ) && (
                            <Item onClick={() => cancelFriendRequest()}>
                                <FaUserMinus className="mr-2" />
                                Cancel Request
                            </Item>
                        )}
                        {auth.friendRequests?.received.some(
                            (f) => f.id === user?.id
                        ) && (
                            <Item onClick={() => acceptFriendRequest()}>
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
                                <Item onClick={() => sendFriendRequest()}>
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
