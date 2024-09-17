import { ChannelTypeIcons } from "@utils";
import classNames from "classnames";
import { Channel } from "@furxus/types";
import { ReactNode } from "react";
import Stack from "@mui/material/Stack";

const ChannelCategoryListItem = ({
    children,
    channel,
}: {
    children: ReactNode;
    channel: Channel;
}) => {
    if (!channel) return <></>;

    return (
        <Stack
            justifyContent="flex-start"
            pl={4}
            py={4}
            className={classNames("w-full", "rounded-md")}
            gap={4}
        >
            <Stack
                className={classNames(
                    "w-full",
                    "hover:bg-neutral-600/40",
                    "rounded-md",
                    "transition-colors",
                    "duration-150"
                )}
                gap={4}
                alignItems="center"
            >
                {ChannelTypeIcons[channel.type]} {channel.name}
            </Stack>
            {children}
        </Stack>
    );
};

export default ChannelCategoryListItem;
