import { Divider, IconButton, Portal, Stack } from "@mui/material";
import { useEffect, useRef, MouseEvent, useState } from "react";
import {
    FaBold,
    FaCode,
    FaItalic,
    FaQuoteLeft,
    FaStrikethrough,
    FaUnderline,
} from "react-icons/fa";
import { Range, Editor, Element } from "slate";
import { useFocused, useSlate } from "slate-react";
import { toggleBlockquote, wrapSelectionWith } from "./MarkdownUtils";

const HoverToolbar = () => {
    const ref = useRef<HTMLDivElement>(null);
    const editor = useSlate();
    const inFocus = useFocused();
    const [activeFormats, setActiveFormats] = useState<string[]>([]);

    useEffect(() => {
        const el = ref.current;
        const { selection } = editor;

        if (!el) return;

        if (
            !selection ||
            !inFocus ||
            Range.isCollapsed(selection) ||
            Editor.string(editor, selection) === ""
        ) {
            el.removeAttribute("style");
            return;
        }

        const domSelection = window.getSelection();
        const domRange = domSelection!.getRangeAt(0);
        const rect = domRange.getBoundingClientRect();
        el.style.opacity = "1";
        el.style.top = `${rect.top + window.scrollY - el.offsetHeight}px`;
        el.style.left = `${
            rect.left + window.scrollX - el.offsetWidth / 2 + rect.width / 2
        }px`;

        // Check active formats
        const formats: string[] = [];
        const [start, end] = Range.edges(selection);

        const checkFormat = (before: string, after: string, format: string) => {
            const extendedStart = {
                path: start.path,
                offset: Math.max(0, start.offset - before.length),
            };
            const extendedEnd = {
                path: end.path,
                offset: end.offset + after.length,
            };
            const extendedRange = { anchor: extendedStart, focus: extendedEnd };
            const extendedText = Editor.string(editor, extendedRange);
            const text = Editor.string(editor, selection);

            if (
                (extendedText.startsWith(before) &&
                    extendedText.endsWith(after)) ||
                (text.startsWith(before) && text.endsWith(after))
            ) {
                formats.push(format);
            }
        };

        const [match] = Editor.nodes(editor, {
            match: (n) => Element.isElement(n) && n.type === "blockquote",
        });
        if (match) formats.push("blockquote");

        checkFormat("**", "**", "bold");
        checkFormat("_", "_", "italic");
        checkFormat("++", "++", "underline");
        checkFormat("~~", "~~", "strike");
        checkFormat("`", "`", "code");

        setActiveFormats(formats);
    }, [editor.selection, inFocus, activeFormats]);

    const textFormat = (e: MouseEvent, syntax: string) => {
        e.preventDefault();
        wrapSelectionWith(editor, syntax, syntax);
    };

    return (
        <Portal>
            <Stack
                position="absolute"
                className="z-10 opacity-0 top-[-1000px] left-[-1000px] transition-opacity duration-700 bg-neutral-900 text-neutral-100 p-2 rounded-md shadow-md"
                ref={ref}
                direction="row"
                gap={1}
            >
                <IconButton
                    size="small"
                    onMouseDown={(e) => textFormat(e, "**")}
                    color={
                        activeFormats.includes("bold") ? "success" : "default"
                    }
                >
                    <FaBold />
                </IconButton>
                <IconButton
                    size="small"
                    onMouseDown={(e) => textFormat(e, "_")}
                    color={
                        activeFormats.includes("italic") ? "success" : "default"
                    }
                >
                    <FaItalic />
                </IconButton>
                <IconButton
                    size="small"
                    onMouseDown={(e) => textFormat(e, "++")}
                    color={
                        activeFormats.includes("underline")
                            ? "success"
                            : "default"
                    }
                >
                    <FaUnderline />
                </IconButton>
                <IconButton
                    size="small"
                    onMouseDown={(e) => textFormat(e, "~~")}
                    color={
                        activeFormats.includes("strike") ? "success" : "default"
                    }
                >
                    <FaStrikethrough />
                </IconButton>
                <IconButton
                    size="small"
                    onMouseDown={(e) => textFormat(e, "`")}
                    color={
                        activeFormats.includes("code") ? "success" : "default"
                    }
                >
                    <FaCode />
                </IconButton>
                <Divider orientation="vertical" flexItem />
                <IconButton
                    onMouseDown={(e) => {
                        e.preventDefault();
                        toggleBlockquote(editor);
                    }}
                    size="small"
                    color={
                        activeFormats.includes("blockquote")
                            ? "success"
                            : "default"
                    }
                >
                    <FaQuoteLeft />
                </IconButton>
            </Stack>
        </Portal>
    );
};

export default HoverToolbar;
