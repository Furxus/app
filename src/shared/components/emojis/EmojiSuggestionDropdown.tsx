import { useEffect, useState } from "react";
import { offset, shift, useFloating, flip } from "@floating-ui/react";
import { Stack } from "@mui/material";

const EmojiSuggestionDropdown = ({ editor }: { editor: any }) => {
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [query, setQuery] = useState("");
    const [index, setIndex] = useState(-1);

    const { refs } = useFloating({
        placement: "top-start",
        middleware: [offset(5), flip(), shift()],
    });

    const filterEmojis = (query: string) =>
        editor.storage.emoji.emojis.filter(
            ({ shortcodes, tags }: any) =>
                shortcodes.find((shortcode: any) =>
                    shortcode.startsWith(query.toLowerCase())
                ) ||
                tags.find((tag: any) => tag.startsWith(query.toLowerCase()))
        );

    useEffect(() => {
        const handleTransaction = () => {
            const { state } = editor;
            const { from } = state.selection;
            const textBefore = state.doc.textBetween(0, from, " ");

            const match = textBefore.match(/:([\w]*)$/);
            if (match) {
                const search = match[1];
                setQuery(search);
                setSuggestions(filterEmojis(search));
                setIndex(-1);

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
        };

        editor.on("transaction", handleTransaction);
        return () => editor.off("transaction", handleTransaction);
    }, [editor, refs.reference]);

    const insertEmoji = (emoji: string) => {
        editor.chain().focus().insertContent(emoji).run();
        setSuggestions([]);
        setQuery("");
        setIndex(-1);
    };

    const handleKeyDown = (event: any) => {
        if (!suggestions.length) return;

        console.log(event.key);

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
                if (index >= 0 && index < suggestions.length) {
                    event.preventDefault();
                    insertEmoji(suggestions[index]);
                }
                break;
            case "Escape":
                setSuggestions([]);
                setQuery("");
                setIndex(-1);
                break;

            default:
                break;
        }
    };

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
                        className="hover:bg-neutral-600 hover:cursor-pointer rounded-lg p-1 w-full"
                        onClick={() => insertEmoji(emoji.emoji)}
                        style={{
                            backgroundColor: i === index ? "#2d3748" : "",
                        }}
                    >
                        {emoji.fallbackImage ? (
                            <img
                                src={emoji.fallbackImage}
                                alt={emoji.name}
                                style={{
                                    width: "1.5rem",
                                    height: "1.5rem",
                                }}
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
