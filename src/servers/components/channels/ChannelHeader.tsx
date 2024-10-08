import { Channel } from "@furxus/types";
import Stack from "@mui/material/Stack";
import { FaHashtag } from "react-icons/fa";

const ChannelHeader = ({ channel }: { channel: Channel }) => {
    return (
        <Stack
            className="w-full bg-neutral-800[0.6] shadow-2xl "
            justifyContent="space-between"
            position="relative"
            pl={2}
            py={2}
        >
            <Stack direction="row" alignItems="center" gap={0.5}>
                <FaHashtag className="mb-0.5 text-neutral-400" />
                <span>{channel.name}</span>
            </Stack>
        </Stack>
    );
};

export default ChannelHeader;
