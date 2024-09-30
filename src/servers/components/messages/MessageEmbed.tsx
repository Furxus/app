import { MessageEmbed as MessageEmbedType } from "@furxus/types";
import { Avatar, Link } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
const MessageEmbed = ({ embed }: { embed: MessageEmbedType }) => {
    return (
        <Box className="w-[25rem] p-4 bg-neutral-900 rounded-xl mt-0.5">
            <Stack direction="column" gap={1}>
                <Stack direction="row" gap={1} alignItems="center">
                    {embed.author?.iconUrl && (
                        <Avatar src={embed.author?.iconUrl} />
                    )}
                    {embed.author?.name && (
                        <Link
                            href={embed.url}
                            underline="hover"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            {embed.author?.name}
                        </Link>
                    )}
                </Stack>
                {embed.title && (
                    <span className="font-bold">{embed.title}</span>
                )}
                {embed.description && (
                    <span className="text-sm">{embed.description}</span>
                )}
                {embed.image && (
                    <Link
                        href={embed.url}
                        underline="hover"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        <img src={embed.image} alt={embed.title} />
                    </Link>
                )}
            </Stack>
        </Box>
    );
};

export default MessageEmbed;
