import { KeyboardEvent, useCallback, useMemo, useState } from "react";
import {
    Slate,
    Editable,
    withReact,
    type RenderElementProps,
    type RenderLeafProps,
} from "slate-react";
import {
    Text,
    createEditor,
    Descendant,
    Node,
    Range,
    Element as SlateElement,
    Path,
    Editor,
    Transforms,
    Point,
} from "slate";
import { withHistory } from "slate-history";

import * as emojiLib from "node-emoji";

import HoverToolbar from "./HoverToolbar";
import { useUserEmojis } from "@/hooks";
import { insertEmoji } from "./MarkdownUtils";

const SHORTCUTS = {
    ">": "blockquote",
    "#": "heading-one",
    "##": "heading-two",
    "###": "heading-three",
};

const withShortcuts = (editor: any) => {
    const { deleteBackward, insertText } = editor;

    editor.insertText = (text: any) => {
        const { selection } = editor;

        if (text.endsWith(" ") && selection && Range.isCollapsed(selection)) {
            const { anchor } = selection;
            const block = Editor.above(editor, {
                match: (n) =>
                    SlateElement.isElement(n) && Editor.isBlock(editor, n),
            });
            const path = block ? block[1] : [];
            const start = Editor.start(editor, path);
            const range = { anchor, focus: start };
            const beforeText = Editor.string(editor, range) + text.slice(0, -1);
            const type = SHORTCUTS[beforeText as keyof typeof SHORTCUTS] as any;

            if (type) {
                Transforms.select(editor, range);

                if (!Range.isCollapsed(range)) {
                    Transforms.delete(editor);
                }

                const newProperties: Partial<SlateElement> = {
                    type,
                };
                Transforms.setNodes<SlateElement>(editor, newProperties, {
                    match: (n) =>
                        SlateElement.isElement(n) && Editor.isBlock(editor, n),
                });

                return;
            }
        }

        insertText(text);
    };

    editor.deleteBackward = (...args: any[]) => {
        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
            const match = Editor.above(editor, {
                match: (n) =>
                    SlateElement.isElement(n) && Editor.isBlock(editor, n),
            });

            if (match) {
                const [block, path] = match;
                const start = Editor.start(editor, path);

                if (
                    !Editor.isEditor(block) &&
                    SlateElement.isElement(block) &&
                    block.type !== "paragraph" &&
                    Point.equals(selection.anchor, start)
                ) {
                    const newProperties: Partial<SlateElement> = {
                        type: "paragraph",
                    };
                    Transforms.setNodes(editor, newProperties);

                    return;
                }
            }

            deleteBackward(...args);
        }
    };

    return editor;
};

const withEmojis = (editor: any) => {
    const { isInline, isVoid, markableVoid } = editor;

    editor.isInline = (element: any) => {
        return element.type === "emoji" ? true : isInline(element);
    };

    editor.isVoid = (element: any) => {
        return element.type === "emoji" ? true : isVoid(element);
    };

    editor.markableVoid = (element: any) => {
        return element.type === "emoji" || markableVoid(element);
    };

    return editor;
};

const MarkdownEditor = () => {
    const editor = useMemo(
        () => withEmojis(withShortcuts(withHistory(withReact(createEditor())))),
        []
    );
    const { emojis: userEmojis } = useUserEmojis();
    const renderElement = useCallback(
        (props: RenderElementProps) => <Element {...props} />,
        []
    );

    const renderLeaf = useCallback(
        (props: RenderLeafProps) => <Leaf {...props} />,
        []
    );

    const [value, setValue] = useState<Descendant[]>(initialValue);
    const decorate = useCallback(([node, path]: [Node, number[]]): Range[] => {
        const ranges: Range[] = [];

        if (Text.isText(node)) {
            const { text } = node;

            // Regular expressions for Markdown syntax (detect the markdown boundaries)
            const patterns = [
                { type: "bold", regex: /(\*\*|__)(.*?)\1/g }, // Bold (**bold** or __bold__)
                { type: "italic", regex: /(\*|_)(.*?)\1/g }, // Italic (*italic* or _italic_)
                { type: "strike", regex: /(~~)(.*?)\1/g }, // Strikethrough (~~strikethrough~~)
                { type: "underlined", regex: /(\+\+)(.*?)\1/g }, // Underlined (++underlined++)
            ];

            // Loop over the patterns for bold, italic, strikethrough
            patterns.forEach(({ regex, type }) => {
                let match;
                while ((match = regex.exec(text)) !== null) {
                    const start = match.index + match[1].length; // Skip the markers
                    const end = start + match[2].length;

                    // Apply ranges only to the content between the markers
                    ranges.push({
                        [type]: true,
                        anchor: { path, offset: start },
                        focus: { path, offset: end },
                    });
                }
            });

            // Handle inline code (single backticks), but only if it's not inside a code block
            const inlineCodeRegex = /`([^`]+)`/g; // Match text wrapped in single backticks
            let match;
            while ((match = inlineCodeRegex.exec(text)) !== null) {
                const start = match.index + 1; // Skip the backticks
                const end = start + match[1].length;

                // Ensure that this is not inside a code block
                if (!text.startsWith("```") && !text.endsWith("```")) {
                    ranges.push({
                        code: true,
                        anchor: { path, offset: start },
                        focus: { path, offset: end },
                    });
                }
            }
        }

        return ranges;
    }, []);

    // Handle breaking blockquote with Shift + Enter
    const handleShiftEnter = (event: KeyboardEvent) => {
        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
            // Get the current node at the selection
            let [node, path] = editor.node(selection.focus.path);

            // Traverse up the path to find the root node
            while (path.length > 1) {
                [node, path] = editor.node(path.slice(0, -1));
            }

            if (SlateElement.isElement(node)) {
                event.preventDefault();

                const newPath = Path.next(path);
                // Insert a new paragraph after the current block
                editor.insertNodes(
                    {
                        type: "paragraph", // Always insert a paragraph
                        children: [{ text: "" }], // Empty paragraph
                    },
                    { at: newPath } // Insert after the current block
                );

                // Move the cursor to the newly inserted paragraph
                editor.select(editor.start(newPath));
            }
        }
    };

    const onChange = useCallback(
        (newValue: Descendant[]) => {
            const { selection } = editor;

            if (selection && Range.isCollapsed(selection)) {
                const block = Editor.above(editor, {
                    match: (n) =>
                        SlateElement.isElement(n) && Editor.isBlock(editor, n),
                });

                if (block) {
                    const path = block[1];
                    const start = Editor.start(editor, path);
                    const end = Editor.end(editor, path);
                    const blockRange = { anchor: start, focus: end };
                    const blockText = Editor.string(editor, blockRange);

                    const emojiRegex = /:\w+:/g;
                    const match = blockText.match(emojiRegex);
                    if (match) {
                        const emoji = match[0].replace(/:/g, "");
                        const emojiUnicode =
                            emojiLib.find(emoji) ||
                            userEmojis.find((e) => e.shortCode === emoji);
                        if (emojiUnicode) {
                            const emojisRange = Editor.range(
                                editor,
                                start,
                                end
                            );

                            console.log(emojisRange, blockRange);

                            Transforms.delete(editor, { at: emojisRange });
                            insertEmoji(editor, emojiUnicode);
                        }
                    }
                }
            }

            setValue(newValue);
        },
        [editor]
    );

    const onKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === "Enter" && event.shiftKey) {
                handleShiftEnter(event);
            }
        },
        [editor]
    );

    return (
        <Slate editor={editor} onChange={onChange} initialValue={value}>
            <HoverToolbar />
            <Editable
                decorate={decorate}
                renderLeaf={renderLeaf}
                renderElement={renderElement}
                onKeyDown={onKeyDown}
                className="w-full border border-green-500/60 rounded-xl p-2"
                spellCheck
                autoFocus
            />
        </Slate>
    );
};

const initialValue: Descendant[] = [
    {
        type: "paragraph",
        children: [
            {
                text: "This paragraph supports various Markdown features such as **Bold**, _Italic_, **_Bold and Italic_**, ~~Strikethrough~~, `Inline Code`",
            },
        ],
    },
    {
        type: "blockquote",
        children: [{ text: "This is a blockquote with a citation." }],
    },
];

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
    let element = <span {...attributes}>{children}</span>;

    if (leaf.code) element = <code {...attributes}>{element}</code>;
    if (leaf.strike) element = <del {...attributes}>{element}</del>;
    if (leaf.italic) element = <em {...attributes}>{element}</em>;
    if (leaf.bold) element = <strong {...attributes}>{element}</strong>;
    if (leaf.underlined) element = <u {...attributes}>{element}</u>;

    return element;
};

const Element = ({ attributes, children, element }: RenderElementProps) => {
    switch (element.type) {
        case "blockquote":
            return (
                <blockquote
                    {...attributes}
                    className="border-l-4 border-gray-500 pl-2"
                >
                    {children}
                </blockquote>
            );
        case "heading-one":
            return (
                <h1 className="text-4xl font-bold" {...attributes}>
                    {children}
                </h1>
            );
        case "heading-two":
            return (
                <h2 className="text-3xl font-bold" {...attributes}>
                    {children}
                </h2>
            );
        case "heading-three":
            return (
                <h3 className="text-2xl font-bold" {...attributes}>
                    {children}
                </h3>
            );
        case "emoji":
            return (
                <span {...attributes} contentEditable={false}>
                    {children}
                    <img
                        className="w-6 h-6 inline-block align-middle"
                        src={element.url}
                        draggable={false}
                        alt={element.name}
                    />
                </span>
            );
        default:
            return <div {...attributes}>{children}</div>;
    }
};

export { MarkdownEditor };
