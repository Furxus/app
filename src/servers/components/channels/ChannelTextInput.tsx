import { useMutation } from "@apollo/client";

import { CreateMessage } from "@gql/messages";
import { useState, KeyboardEvent } from "react";
import { BaseServerChannel } from "@furxus/types";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MDEditor from "@uiw/react-md-editor";

// Markdown imports
import Markdown from "react-markdown";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkParse from "remark-parse";
import { rehypeTwemoji, RehypeTwemojiOptions } from "rehype-twemoji";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

const ChannelTextInput = ({ channel }: { channel: BaseServerChannel }) => {
    const [message, setMessage] = useState("");
    const [createMessage] = useMutation(CreateMessage, {
        variables: {
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
        <Stack
            position="sticky"
            direction="row"
            bottom={0}
            alignItems="center"
            className="w-full bg-neutral-800"
            p={2}
        >
            <MDEditor
                value={message}
                onChange={(value) => setMessage(value || "")}
                onKeyDown={onKeyDown}
                preview="preview"
                height={100}
                className="w-full"
                previewOptions={{
                    remarkPlugins: [
                        remarkParse,
                        remarkGfm,
                        remarkBreaks,
                        remarkEmoji,
                    ],
                    rehypePlugins: [
                        rehypeSanitize,
                        rehypeRaw,
                        [
                            rehypeTwemoji,
                            {
                                format: "svg",
                            } satisfies RehypeTwemojiOptions,
                        ],
                    ],
                }}
            />
        </Stack>
    );

    /**
     * <TextField
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
     */
};

export default ChannelTextInput;
