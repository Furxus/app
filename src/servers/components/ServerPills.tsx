import Box from "@mui/material/Box";
import { FC } from "react";

export const NotificationIndicator: FC = () => (
    <Box
        width="8px"
        height="8px"
        position="absolute"
        className="bg-white"
        style={{ borderRadius: "0 4px 4px 0" }}
        ml="-4px"
        mt="20px"
        left={0}
    />
);

export const ChannelNotificationIndicator: FC = () => (
    <Box
        width="8px"
        height="8px"
        position="absolute"
        className="bg-white"
        style={{ borderRadius: "0 4px 4px 0" }}
        ml="-4px"
        mt="8px"
        left="-10px"
    />
);

export const ActiveServerPill: FC = () => (
    <Box
        width="8px"
        height="40px"
        className="bg-green-500/60"
        position="absolute"
        style={{ borderRadius: "0 4px 4px 0" }}
        left={0}
        ml="-16px"
        mt="8px"
    />
);

export const HoverServerPill: FC = () => (
    <Box
        width="8px"
        height="20px"
        className="bg-green-500/80"
        position="absolute"
        style={{ borderRadius: "0 4px 4px 0" }}
        left={0}
        ml="-16px"
        mt="8px"
    />
);
