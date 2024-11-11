import { useCallback, useEffect, useState } from "react";
import { offset, shift, useFloating, flip } from "@floating-ui/react";
import Stack from "@mui/material/Stack";
import { Editor } from "@tiptap/react";
import { TextSelection } from "@tiptap/pm/state";
import { useAuth } from "@/hooks";

const EmojiSuggestionDropdown = ({
    editor,
    onSelectEmoji,
}: {
    editor: Editor;
    onSelectEmoji: () => void;
}) => {
    const { user } = useAuth();
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [query, setQuery] = useState("");
    const [index, setIndex] = useState(-1);

    const { refs } = useFloating({
        placement: "top-start",
        middleware: [offset(5), flip(), shift()],
    });

    const filterEmojis = (query: string) =>
        editor.storage.emoji.emojis.filter(
            ({ shortcodes, tags, createdBy }: any) =>
                createdBy === user.id &&
                (shortcodes.find((shortcode: any) =>
                    shortcode.startsWith(query.toLowerCase())
                ) ||
                    tags.find((tag: any) =>
                        tag.startsWith(query.toLowerCase())
                    ))
        );

    const handleTransaction = useCallback(() => {
        const { state } = editor;
        const { from } = state.selection;
        const textBefore = state.doc.textBetween(0, from, " ");

        const match = textBefore.match(/:([\w]*)$/);
        if (match) {
            const search = match[1];
            setQuery(search);
            setSuggestions(filterEmojis(search));
            setIndex(0);

            const cursorPos = editor.view.coordsAtPos(from);
            refs.reference.current = {
                getBoundingClientRect: () => ({
                    x: cursorPos.left,
                    y: cursorPos.top,
                    width: 0,
                    height: 0,
                    top: cursorPos.top,
                    left: cursorPos.left,
                    right: cursorPos.left,
                    bottom: cursorPos.top,
                }),
            };
        } else {
            setSuggestions([]);
        }
    }, [editor, refs.reference]);

    useEffect(() => {
        editor.on("transaction", handleTransaction);
        return () => {
            editor.off("transaction", handleTransaction);
        };
    }, [editor, handleTransaction]);

    const insertEmoji = (emoji: any) => {
        const { state, view } = editor;

        const { from } = state.selection;
        const textBefore = state.doc.textBetween(0, from, " ");

        const match = textBefore.match(/:([\w]*)$/);
        if (match) {
            const textBeforeMatch = match[0];
            const fromPos = from - textBeforeMatch.length;

            const node = editor.schema.nodes.emoji.create({
                id: emoji.id,
                name: emoji.name,
                emoji: emoji.emoji,
            });

            const transaction = state.tr
                .delete(fromPos, from)
                .insert(fromPos, node)
                .insertText(" ");

            // Now, update the transaction with the correct cursor position
            const updatedTransaction = transaction.setSelection(
                TextSelection.create(transaction.doc, fromPos + 2)
            );

            // Finally, dispatch the updated transaction with the new selection
            view.dispatch(updatedTransaction);

            // Focus the editor again to prevent focus loss
            view.focus();
        }
        setSuggestions([]);
        setQuery("");
        setIndex(0);
        onSelectEmoji();
    };

    const handleKeyDown = (event: any) => {
        if (!suggestions.length) return;

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                setIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
                break;
            case "ArrowUp":
                event.preventDefault();
                setIndex((prevIndex) =>
                    prevIndex === 0 ? suggestions.length - 1 : prevIndex - 1
                );
                break;
            case "Enter":
                event.preventDefault();
                if (index >= 0 && index < suggestions.length) {
                    insertEmoji(suggestions[index]);
                }
                break;
            case "Escape":
                setSuggestions([]);
                setQuery("");
                setIndex(0);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (index >= 0 && index < suggestions.length) {
            const el = document.getElementById(`emoji-${index}`);
            if (el) {
                el.scrollIntoView({
                    behavior: "instant",
                    block: "nearest",
                });
            }
        }
    }, [index]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [suggestions, index]);

    if (suggestions.length === 0 || query.length < 2) return <></>;

    return (
        <div
            className="mb-4 rounded-xl w-full bg-neutral-700 p-2 max-h-96 overflow-y-auto border border-green-500/60"
            style={{
                zIndex: 1000,
            }}
            ref={refs.floating as React.LegacyRef<HTMLDivElement>}
        >
            <Stack position="relative">
                {suggestions.map((emoji, i) => (
                    <Stack
                        direction="row"
                        key={emoji.name}
                        gap={1}
                        id={`emoji-${i}`}
                        className="hover:bg-neutral-600 hover:cursor-pointer rounded-lg p-1 w-full"
                        onClick={() => insertEmoji(emoji)}
                        style={{
                            backgroundColor: i === index ? "#2d3748" : "",
                        }}
                    >
                        {emoji.fallbackImage ? (
                            <img
                                className="size-[1.4em]"
                                src={emoji.fallbackImage}
                                alt={emoji.name}
                            />
                        ) : (
                            <>{emoji.emoji}</>
                        )}
                        :{emoji.name}:
                    </Stack>
                ))}
            </Stack>
        </div>
    );
};

export default EmojiSuggestionDropdown;
