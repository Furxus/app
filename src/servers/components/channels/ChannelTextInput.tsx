import { useMutation } from "@apollo/client";

import { CreateMessage } from "@gql/messages";
import { useState, KeyboardEvent } from "react";
import { Channel } from "@furxus/types";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

const ChannelTextInput = ({
    serverId,
    channel,
}: {
    serverId: string;
    channel: Channel;
}) => {
    const [message, setMessage] = useState("");
    const [createMessage] = useMutation(CreateMessage, {
        variables: {
            serverId,
            channelId: channel.id,
            content: message,
        },
    });

    const sendMessage = () => {
        createMessage();
        setMessage("");
    };

    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            if (message.startsWith("```") && !message.endsWith("```")) {
                setMessage(`${message}\n`);
                return;
            }

            sendMessage();
        }
    };

    return (
        <>
            <Stack
                position="sticky"
                direction="row"
                bottom={0}
                alignItems="center"
                className="w-full bg-neutral-800"
                p={2}
            >
                <TextField
                    className="w-full"
                    sx={{
                        "& .MuiInputBase-root": {
                            borderRadius: 4,
                            backgroundColor: "rgb(0 0 0 / 8%)",
                        },
                    }}
                    color="success"
                    placeholder={`Message #${channel.name}`}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={onKeyDown}
                    multiline
                    autoComplete="off"
                    value={message}
                />
            </Stack>
        </>
    );
};

export default ChannelTextInput;
