import MAvatar, { AvatarProps } from "@mui/material/Avatar";
import { Server } from "@furxus/types";
import { useRef } from "react";
import { useHover } from "usehooks-ts";

const Avatar = (props: AvatarProps & { server?: Server }) => {
    const { server } = props;

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

    return <MAvatar {...props} />;
};

export default Avatar;
