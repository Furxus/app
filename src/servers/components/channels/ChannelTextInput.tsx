import { useMutation } from "@apollo/client";

import { CreateMessage } from "@gql/messages";
import { useState, KeyboardEvent } from "react";
import { BaseServerChannel } from "@furxus/types";
import Stack from "@mui/material/Stack";

// Markdown imports

import { EditorContent, useEditor } from "@tiptap/react";

// Tiptap imports
import Document from "@tiptap/extension-document";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import CodeBlockLowLight from "@tiptap/extension-code-block-lowlight";
import Emoji, { gitHubEmojis } from "@tiptap-pro/extension-emoji";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import Mention from "@tiptap/extension-mention";
import Parapgraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Markdown } from "tiptap-markdown";
import Bold from "@tiptap/extension-bold";
import Code from "@tiptap/extension-code";
import Highlight from "@tiptap/extension-highlight";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import Strike from "@tiptap/extension-strike";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";

import { all, createLowlight } from "lowlight";

import "@css/tiptap.css";
import { Typography } from "@mui/material";

import emojiSuggestion from "@/utils/emojiSuggestion.tsx";

const lowlight = createLowlight(all);

const extensions = [
    Document,
    BulletList,
    CodeBlockLowLight.configure({
        lowlight,
    }),
    Emoji.configure({
        enableEmoticons: true,
        suggestion: emojiSuggestion,
        emojis: gitHubEmojis,
    }),
    ListItem,
    OrderedList,
    HardBreak,
    Heading.configure({ levels: [1, 2, 3] }),
    Mention,
    Parapgraph,
    Text,
    Markdown,
    Bold,
    Code,
    Highlight,
    Italic,
    Link,
    Strike,
    Subscript,
    Superscript,
    TextStyle,
    Underline,
];

const ChannelTextInput = ({ channel }: { channel: BaseServerChannel }) => {
    const [message, setMessage] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [createMessage] = useMutation(CreateMessage, {
        variables: {
            channelId: channel.id,
            content: message,
        },
        onError: (error) => {
            setError(error.message);
        },
    });

    const editor = useEditor({
        extensions,
        content: message,
        onUpdate({ editor }) {
            setMessage(editor.storage.markdown.getMarkdown());
        },
    });

    const sendMessage = () => {
        createMessage();
        setMessage("");
        editor?.commands.setContent("");
    };

    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            if (message.startsWith("```") && !message.endsWith("```")) {
                editor?.commands.insertContent("\n");
                return;
            }

            sendMessage();
        }
    };

    return (
        <Stack
            position="sticky"
            direction="column"
            bottom={0}
            className="w-full"
            p={2}
        >
            <EditorContent
                onKeyDown={onKeyDown}
                className="w-full"
                editor={editor}
                placeholder={`Message #${channel.name}`}
            />
            {error && (
                <Typography variant="caption" color="error">
                    {error}
                </Typography>
            )}
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
