import {
    useEffect,
    KeyboardEvent,
    useCallback,
    useMemo,
    useState,
} from "react";
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
import { isKeyHotkey } from "is-hotkey";
import { withHistory } from "slate-history";

import * as emojiLib from "node-emoji";

import HoverToolbar from "./HoverToolbar";
import { useUserEmojis } from "@/hooks";
import { useAppStore } from "@/hooks/useAppStore";
import { insertEmoji } from "./MarkdownUtils";
import {
    deserializeFromMarkdown,
    serializeToMarkdown,
} from "@/utils/editorUtils";
import { observer } from "mobx-react-lite";
import { BaseServerChannel, Channel, User } from "@furxus/types";

const SHORTCUTS = {
    ">": "blockquote",
    "#": "heading-one",
    "##": "heading-two",
    "###": "heading-three",
};

const withShortcuts = (editor: Editor) => {
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

    editor.deleteBackward = (...args: any) => {
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

            deleteBackward(args[0]);
        }
    };

    return editor;
};

const withEmojis = (editor: Editor) => {
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

    editor.isSelectable = (element: any) => {
        return element.type !== "emoji";
    };

    return editor;
};

const MarkdownEditor = ({
    channel,
    recipient,
    onSubmit,
}: {
    channel: Channel;
    recipient?: User;
    onSubmit: any;
}) => {
    const editor = useMemo(
        () => withEmojis(withShortcuts(withHistory(withReact(createEditor())))),
        []
    );
    const { emojis: userEmojis } = useUserEmojis();
    const { channels } = useAppStore();

    const renderElement = useCallback(
        (props: RenderElementProps) => <Element {...props} />,
        []
    );

    const renderLeaf = useCallback(
        (props: RenderLeafProps) => <Leaf {...props} />,
        []
    );

    const [value, setValue] = useState<Descendant[]>(
        deserializeFromMarkdown(channels.getInput(channel.id))
    );

    useEffect(() => {
        const newValue = deserializeFromMarkdown(channels.getInput(channel.id));
        setValue(newValue);
        editor.children = newValue;
    }, [channels, channel.id]);

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

    const handleChange = useCallback(
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
                        const emojiShortcode = match[0];
                        const emoji = emojiShortcode.replace(/:/g, "");
                        const emojiUnicode =
                            emojiLib.find(emoji) ||
                            userEmojis.find((e) => e.shortCode === emoji);
                        if (emojiUnicode) {
                            const shortcodeStart = Editor.before(
                                editor,
                                selection,
                                {
                                    unit: "character",
                                    distance: emojiShortcode.length,
                                }
                            );
                            const shortcodeRange = {
                                anchor: shortcodeStart!,
                                focus: selection.anchor,
                            };
                            Transforms.select(editor, shortcodeRange);
                            Transforms.delete(editor);

                            insertEmoji(editor, emojiUnicode);
                        }
                    }
                }
            }

            const serialized = serializeToMarkdown(newValue);

            setValue(newValue);
            channels.setInput(channel.id, serialized);
        },
        [editor, channels, channel.id, userEmojis]
    );

    const onKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === "Enter" && event.shiftKey) {
                handleShiftEnter(event);
            }

            if (event.key === "Enter" && !event.shiftKey) {
                onSubmit();
                editor.children = [
                    { type: "paragraph", children: [{ text: "" }] },
                ];
                event.preventDefault();
            }

            const { selection } = editor;

            if (selection && Range.isCollapsed(selection)) {
                const { nativeEvent } = event;

                if (isKeyHotkey("left", nativeEvent)) {
                    event.preventDefault();
                    Transforms.move(editor, {
                        unit: "offset",
                        reverse: true,
                    });
                }

                if (isKeyHotkey("right", nativeEvent)) {
                    event.preventDefault();
                    Transforms.move(editor, { unit: "offset" });
                }
            }
        },
        [editor, onSubmit, handleShiftEnter, channels, channel.id]
    );

    return (
        <Slate editor={editor} onChange={handleChange} initialValue={value}>
            <HoverToolbar />
            <Editable
                decorate={decorate}
                renderLeaf={renderLeaf}
                placeholder={
                    recipient
                        ? `Message @${
                              recipient.displayName ?? recipient.username
                          }`
                        : `Message #${(channel as BaseServerChannel).name}`
                }
                renderPlaceholder={({
                    children,
                    attributes: { style, ...attributes },
                }) => (
                    <div
                        {...attributes}
                        className="text-white opacity-30 block absolute top-2 left-2 pointer-events-none select-none max-w-full w-full"
                    >
                        {children}
                    </div>
                )}
                renderElement={renderElement}
                onKeyDown={onKeyDown}
                className="w-full h-full border border-green-500/60 rounded-xl p-2"
                spellCheck
                autoFocus
            />
        </Slate>
    );
};

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
                <span
                    className="select-none"
                    {...attributes}
                    contentEditable={false}
                >
                    <img
                        className="w-6 h-6 inline-block align-middle"
                        src={element.url}
                        draggable={false}
                        alt={element.name}
                    />
                    {children}
                </span>
            );
        default:
            return <div {...attributes}>{children}</div>;
    }
};

export default observer(MarkdownEditor);
