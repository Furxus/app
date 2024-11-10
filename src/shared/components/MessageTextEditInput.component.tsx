import { useState, Dispatch, SetStateAction } from "react";
import { Message } from "@furxus/types";
import Stack from "@mui/material/Stack";
import MLink from "@mui/material/Link";

import { EditorContent, JSONContent, useEditor } from "@tiptap/react";

import "@css/tiptap.css";
import { Typography } from "@mui/material";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import EmojiSuggestionDropdown from "./emojis/EmojiSuggestionDropdown.component";
import { extensions } from "../../editorExtensions";
import Link from "@tiptap/extension-link";
import classNames from "classnames";

const ChannelTextEditInput = ({
    message,
    deleteMessage,
    setMessageEditing,
}: {
    message: Message;
    deleteMessage: () => void;
    setMessageEditing: Dispatch<SetStateAction<boolean>>;
}) => {
    const [content, setContent] = useState(message.content);
    const [json, setJson] = useState<JSONContent | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isTypingEmoji, setIsTypingEmoji] = useState(false);

    const { mutate: mEditMessage } = useMutation({
        mutationKey: ["editMessage"],
        mutationFn: () =>
            api.patch(
                `/channels/${message.channel.id}/messages/${message.id}`,
                { content: json }
            ),
        onError: (error: any) => {
            setError(error.response.data.message);
        },
        onSuccess: () => {
            setError(null);
        },
    });

    const editMessage = () => {
        if (!isTypingEmoji && content.trim() === "") {
            deleteMessage();
            setMessageEditing(false);
            return;
        } else if (content === message.content) {
            setMessageEditing(false);
            return;
        }
        mEditMessage();
        setMessageEditing(false);
    };

    const handleEmojiSelection = (selected: boolean) => {
        setIsTypingEmoji(selected);
    };

    const editor = useEditor({
        extensions: [...extensions, Link.configure({ openOnClick: false })],
        content: content,
        onUpdate({ editor }) {
            setContent(editor.storage.markdown.getMarkdown());
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
                        editMessage();
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
                    onSelectEmoji={() => handleEmojiSelection(false)}
                    editor={editor}
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
                    color={content.length === 2000 ? "error" : "inherit"}
                >
                    {content.length}/2000
                </Typography>
                {error && (
                    <Typography variant="caption" color="error">
                        {error}
                    </Typography>
                )}
            </Stack>
            <Typography variant="subtitle2" className="">
                escape to{" "}
                <MLink
                    className="cursor-pointer"
                    onClick={() => setMessageEditing(false)}
                >
                    cancel
                </MLink>{" "}
                or press enter to{" "}
                <MLink className="cursor-pointer" onClick={() => editMessage()}>
                    save
                </MLink>{" "}
                ● <span className="font-semibold">empty message</span> to delete
            </Typography>
            {error && (
                <Typography variant="caption" color="error">
                    {error}
                </Typography>
            )}
        </Stack>
    );
};

export default ChannelTextEditInput;
