import { Alert, AvatarProps, Avatar as MAvatar, Snackbar } from "@mui/material";
import { Server, User } from "@furxus/types";
import { useRef, useState } from "react";
import { useHover } from "usehooks-ts";
import { Menu, useContextMenu, Item } from "react-contexify";
import { useAuth } from "@/hooks";
import { FaUserCircle, FaUserPlus } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import { SendFriendRequest } from "@/gql/friends";

const Avatar = (props: AvatarProps & { user?: User; server?: Server }) => {
    const { user: auth } = useAuth();
    const { user, server } = props;

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [sendFriendRequest] = useMutation(SendFriendRequest, {
        variables: { userId: user?.id },
        onCompleted: () => {
            setSnackbarVisible(true);
        },
        onError: (err) => {
            setError(err.message);
        },
    });

    const onClose = () => {
        setSnackbarVisible(false);
        setError(null);
    };

    const hoverRef = useRef<HTMLDivElement>(null);
    const isHovered = useHover(hoverRef);

    const { show } = useContextMenu();

    if (server) {
        return isHovered ? (
            <MAvatar
                ref={hoverRef}
                src={server?.icon}
                alt={server?.name}
                {...props}
            />
        ) : (
            <MAvatar
                ref={hoverRef}
                src={
                    server?.icon
                        ?.replaceAll("gif", "png")
                        .replaceAll("a_", "") ?? server?.icon
                }
                alt={server?.nameAcronym}
                {...props}
            />
        );
    }

    if (user) {
        const showUserMenu = (event: any) => {
            event.stopPropagation();
            show({
                id: `avatar-menu-${user.id}`,
                event,
            });
        };

        return (
            <>
                {isHovered ? (
                    <MAvatar
                        ref={hoverRef}
                        src={user?.avatar ?? user?.defaultAvatar}
                        alt={user?.username}
                        onContextMenu={showUserMenu}
                        {...props}
                    />
                ) : (
                    <MAvatar
                        ref={hoverRef}
                        src={
                            user?.avatar
                                ?.replaceAll("gif", "png")
                                .replaceAll("a_", "") ?? user?.defaultAvatar
                        }
                        alt={user?.username}
                        onContextMenu={showUserMenu}
                        {...props}
                    />
                )}
                <Menu id={`avatar-menu-${user.id}`}>
                    <Item onClick={() => console.log("view profile")}>
                        <FaUserCircle className="mr-2" />
                        View profile
                    </Item>
                    {auth?.id !== user.id && (
                        <Item onClick={() => sendFriendRequest()}>
                            <FaUserPlus className="mr-2" />
                            Send friend request
                        </Item>
                    )}
                </Menu>
                <Snackbar
                    open={snackbarVisible}
                    onClose={() => onClose()}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    autoHideDuration={6000}
                >
                    <Alert severity={error ? "error" : "success"}>
                        {error ? error : "Friend request sent!"}
                    </Alert>
                </Snackbar>
            </>
        );
    }

    return <MAvatar {...props} />;
};

export default Avatar;
