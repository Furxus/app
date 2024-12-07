import { useState } from "react";
import { BaseServerChannel, Channel, User } from "@furxus/types";
import Stack from "@mui/material/Stack";

// Markdown imports

import { JSONContent, useEditor } from "@tiptap/react";

// Tiptap imports
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import EmojiSuggestionDropdown from "./emojis/EmojiSuggestionDropdown.component";
import classNames from "classnames";
import EmojiPicker from "./emojis/EmojiPicker.component";
import { useEditorExtensions } from "@/hooks";
import { MarkdownEditor } from "./markdown/MarkdownEditor";

const ChannelTextInput = ({
    channel,
    recipient,
}: {
    channel: Channel;
    recipient?: User;
}) => {
    const [messageContent, setMessageContent] = useState("");
    const { extensions, defaultEmojis } = useEditorExtensions();
    const [json, setJson] = useState<JSONContent | null>(null);

    const [isTypingEmoji, setIsTypingEmoji] = useState(false);

    const { mutate: createMessage } = useMutation({
        mutationKey: ["createMessage"],
        mutationFn: (values: any) =>
            api.put(`/channels/${channel.id}/messages`, values),
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

                // Track the "current word" being typed
                const currentWord = view.state.doc.textBetween(
                    view.state.selection.from - 20,
                    view.state.selection.from
                );

                // URL detection regex
                const urlPattern =
                    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

                // Only set isTypingEmoji to true if the current word does not match a URL pattern
                if (
                    !urlPattern.test(currentWord) &&
                    currentWord.endsWith(":")
                ) {
                    setIsTypingEmoji(true);
                }

                if (urlPattern.test(currentWord)) {
                    setIsTypingEmoji(false);
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
                    editor={editor}
                    onSelectEmoji={() => handleEmojiSelection(false)}
                />
            )}
            <Stack direction="row" justifyContent="center" alignItems="center">
                <MarkdownEditor />
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
        </Stack>
    );
};

export default ChannelTextInput;
