import { api } from "@/api";
import { DMChannel, User } from "@furxus/types";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useMutation } from "@tanstack/react-query";
import { useState, KeyboardEvent } from "react";

const DMTextInput = ({
    recipient,
    channel,
}: {
    recipient: User;
    channel: DMChannel;
}) => {
    const [message, setMessage] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { mutate: createMessage } = useMutation({
        mutationKey: ["createMessage"],
        mutationFn: () =>
            api.post(`/channels/${channel.id}/messages`, { content: message }),
        onError: (error) => {
            setError(error.message);
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
                color="info"
                sx={{
                    "& .MuiInputBase-root": {
                        borderRadius: 4,
                        backgroundColor: "rgb(0 0 0 / 8%)",
                    },
                }}
                placeholder={`Message @${
                    recipient.displayName ?? recipient.username
                }`}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={onKeyDown}
                multiline
                autoComplete="off"
                value={message}
            />
            {error && <span>{error}</span>}
        </Stack>
    );
};

export default DMTextInput;
