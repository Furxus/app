import { useState } from "react";
import { BaseServerChannel, Channel, User } from "@furxus/types";
import Stack from "@mui/material/Stack";

// Markdown imports

import { EditorContent, JSONContent, useEditor } from "@tiptap/react";

// Tiptap imports
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";

import { Typography } from "@mui/material";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import EmojiSuggestionDropdown from "./emojis/EmojiSuggestionDropdown.component";
import { extensions } from "../../editorExtensions";
import classNames from "classnames";

const ChannelTextInput = ({
    channel,
    recipient,
}: {
    channel: Channel;
    recipient?: User;
}) => {
    const [messageContent, setMessageContent] = useState("");
    const [json, setJson] = useState<JSONContent | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isTypingEmoji, setIsTypingEmoji] = useState(false);

    const { mutate: createMessage } = useMutation({
        mutationKey: ["createMessage"],
        mutationFn: (values: any) =>
            api.put(`/channels/${channel.id}/messages`, values),
        onError: (error: any) => {
            setError(error.response.data.message);
        },
        onSuccess: () => {
            setError(null);
        },
    });

    const sendMessage = () => {
        if (!channel) return;
        if (!isTypingEmoji && messageContent.trim() !== "") {
            createMessage({ content: json });
            setMessageContent("");
            setJson(null);
            editor?.commands.setContent("");
        }
    };

    const handleEmojiSelection = (selected: boolean) => {
        setIsTypingEmoji(selected);
    };

    const editor = useEditor({
        extensions: [
            ...extensions,
            Placeholder.configure({
                placeholder: `Message ${
                    recipient
                        ? `@${recipient?.displayName ?? recipient?.username}`
                        : `#${(channel as BaseServerChannel)?.name}`
                }`,
            }),
            Link.configure({ openOnClick: false }),
        ],
        content: messageContent,
        onUpdate({ editor }) {
            setMessageContent(editor.storage.markdown.getMarkdown());
            setJson(editor.getJSON());
        },
        editorProps: {
            handleKeyDown(view, event) {
                if (event.key === "Enter") {
                    if (event.shiftKey) {
                        // Shift + Enter creates a new line
                        return false; // Allow default behavior to create a new line
                    }

                    if (isTypingEmoji) {
                        event.preventDefault(); // Prevent new line while selecting emoji
                    } else {
                        event.preventDefault(); // Prevent new line and send the message
                        sendMessage();
                    }
                    return true;
                }

                // Set emoji typing state when `:` is typed
                const typedText = view.state.doc.textBetween(
                    view.state.selection.from - 1,
                    view.state.selection.from
                );
                if (typedText === ":" && !event.shiftKey) {
                    setIsTypingEmoji(true);
                }

                // Reset emoji typing state on space or enter
                if (event.key === " " || event.key === "Enter") {
                    setIsTypingEmoji(false);
                }

                return false;
            },
            attributes: {
                class: classNames(
                    "prose dark:prose-invert max-w-none [&_ol]:list-decimal [&_ul]:list-disc"
                ),
            },
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
            {editor && (
                <EmojiSuggestionDropdown
                    editor={editor}
                    onSelectEmoji={() => handleEmojiSelection(false)}
                />
            )}
            <EditorContent className="w-full" editor={editor} />
            <Stack
                position="relative"
                direction="row"
                justifyContent="flex-end"
                gap={1}
            >
                <Typography
                    position="absolute"
                    bottom={0}
                    right={5}
                    variant="caption"
                    color={messageContent.length === 2000 ? "error" : "inherit"}
                >
                    {messageContent.length}/2000
                </Typography>
                {error && (
                    <Typography variant="caption" color="error">
                        {error}
                    </Typography>
                )}
            </Stack>
        </Stack>
    );
};

export default ChannelTextInput;