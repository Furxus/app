import { AvatarProps, Avatar as MAvatar } from "@mui/material";
import { Server, User } from "@furxus/types";
import { useRef } from "react";
import { useHover } from "usehooks-ts";

const Avatar = (props: AvatarProps & { user?: User; server?: Server }) => {
    const { user, server } = props;

    const hoverRef = useRef<HTMLDivElement>(null);
    const isHovered = useHover(hoverRef);

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
        return isHovered ? (
            <MAvatar
                ref={hoverRef}
                src={user?.avatar ?? user?.defaultAvatar}
                alt={user?.username}
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
                {...props}
            />
        );
    }

    return <MAvatar {...props} />;
};

export default Avatar;
