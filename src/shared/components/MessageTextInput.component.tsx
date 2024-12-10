import { Channel, User } from "@furxus/types";
import Stack from "@mui/material/Stack";

// Tiptap imports

import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import EmojiPicker from "./emojis/EmojiPicker.component";
import MarkdownEditor from "./markdown/MarkdownEditor";

import { observer } from "mobx-react-lite";
import { useAppStore } from "@/hooks/useAppStore";

const ChannelTextInput = ({
    channel,
    recipient,
}: {
    channel: Channel;
    recipient?: User;
}) => {
    const { channels } = useAppStore();

    const { mutate: createMessage } = useMutation({
        mutationKey: ["createMessage"],
        mutationFn: () =>
            api.put(`/channels/${channel.id}/messages`, {
                content: channels.getInput(channel.id).trim(),
                recipient: recipient?.id,
            }),
        onSuccess: () => {
            channels.setInput(channel.id, "");
        },
    });

    return (
        <Stack
            position="sticky"
            direction="column"
            bottom={0}
            className="w-full"
            p={2}
        >
            <Stack direction="row" justifyContent="center" alignItems="center">
                <MarkdownEditor channel={channel} onSubmit={createMessage} />
            </Stack>
            <Stack
                position="relative"
                direction="row"
                justifyContent="flex-end"
                gap={1}
            >
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    position="absolute"
                    bottom={0}
                    right={10}
                    gap={1}
                >
                    <EmojiPicker onChange={() => {}} />
                </Stack>
            </Stack>
        </Stack>
    );
};

export default observer(ChannelTextInput);
