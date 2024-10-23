import { useMutation } from "@apollo/client";

import { CreateMessage } from "@gql/messages";
import { useState, KeyboardEvent } from "react";
import { BaseServerChannel } from "@furxus/types";
import Stack from "@mui/material/Stack";

// Markdown imports

import {
    BubbleMenu,
    EditorContent,
    EditorProvider,
    FloatingMenu,
    useEditor,
} from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";

import "@css/tiptap.css";

const extensions = [StarterKit, Markdown];

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

            console.log("Enter pressed");

            if (message.startsWith("```") && !message.endsWith("```")) {
                setMessage(`${message}\n`);
                return;
            }

            sendMessage();
        }
    };

    const editor = useEditor({
        extensions,
        content: message,
        onUpdate({ editor }) {
            console.log("content", editor.storage.markdown.getMarkdown());
            setMessage(editor.storage.markdown.getMarkdown());
        },
    });

    return (
        <Stack
            position="sticky"
            direction="column"
            bottom={0}
            alignItems="center"
            className="w-full"
            p={2}
        >
            <EditorContent
                onKeyDown={onKeyDown}
                className="w-full"
                editor={editor}
                placeholder={`Message #${channel.name}`}
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
