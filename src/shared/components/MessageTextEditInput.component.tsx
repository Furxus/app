import { useState, Dispatch, SetStateAction } from "react";
import { Message } from "@furxus/types";
import Stack from "@mui/material/Stack";
import MLink from "@mui/material/Link";

import {
    EditorContent,
    generateText,
    JSONContent,
    useEditor,
} from "@tiptap/react";

import "@css/tiptap.css";
import { Typography } from "@mui/material";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import EmojiSuggestionDropdown from "./emojis/EmojiSuggestionDropdown.component";
import Link from "@tiptap/extension-link";
import classNames from "classnames";
import BubbleMenu from "./BubbleMenu.component";
import EmojiPicker from "./emojis/EmojiPicker.component";
import { useEditorExtensions } from "@/hooks";

const ChannelTextEditInput = ({
    message,
    deleteMessage,
    setMessageEditing,
}: {
    message: Message;
    deleteMessage: () => void;
    setMessageEditing: Dispatch<SetStateAction<boolean>>;
}) => {
    const { extensions, defaultEmojis } = useEditorExtensions();
    const [content, setContent] = useState(message.content);
    const [json, setJson] = useState<JSONContent>(message.content);
    const [error, setError] = useState<string | null>(null);
    const [isTypingEmoji, setIsTypingEmoji] = useState(false);

    const { mutate: mEditMessage } = useMutation({
        mutationKey: ["editMessage", { messageId: message.id }],
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
        const text = generateText(json, extensions);

        if (!isTypingEmoji && text.trim() === "") {
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
                        return false;
                    }

                    if (isTypingEmoji) {
                        event.preventDefault(); // Prevent new line while selecting emoji
                    } else {
                        event.preventDefault(); // Prevent new line and send the message
                        editMessage();
                    }
                    return true;
                }

                if (event.key === "Escape") {
                    setMessageEditing(false);
                    return true;
                }

                // Track the "current word" being typed
                const currentWord = view.state.doc.textBetween(
                    view.state.selection.from - 20,
                    view.state.selection.from
                );

                // URL detection regex
                const urlPattern = /https?:\/\/[^\s]+/;

                // Only set isTypingEmoji to true if the current word does not match a URL pattern
                if (
                    !urlPattern.test(currentWord) &&
                    currentWord.endsWith(":")
                ) {
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

    const addEmoji = (emoji: any) => {
        if (!editor) return;
        if (emoji.native) {
            editor
                .chain()
                .focus("end")
                .insertContent(emoji.native + " ")
                .run();

            return;
        }

        const { state } = editor;

        const node = editor.schema.nodes.emoji.create({
            name: defaultEmojis.find((e) => e.name === emoji.name)
                ? `${emoji.name} (Custom)`
                : emoji.name,
        });

        const transaction = state.tr
            .insert(state.selection.from, node)
            .insertText(" ");

        editor.view.dispatch(transaction);
    };

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
            <Stack direction="row" justifyContent="center" alignItems="center">
                <BubbleMenu editor={editor} />
                <EditorContent className="w-full" editor={editor} />
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
                    <EmojiPicker onChange={addEmoji} />
                </Stack>
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
