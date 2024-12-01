import { EmojiElement } from "@/types";
import { Editor, Transforms, Range, Element } from "slate";

import twemoji from "@twemoji/api";

export const wrapSelectionWith = (
    editor: Editor,
    before: string,
    after: string
) => {
    const { selection } = editor;
    if (selection && !Range.isCollapsed(selection)) {
        const [start, end] = Range.edges(selection);
        const text = Editor.string(editor, selection);

        // Extend the selection to include the surrounding text
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

        // Check if the extended text is already wrapped with the specified syntax
        const isExtendedWrapped =
            extendedText.startsWith(before) && extendedText.endsWith(after);

        // Check if the original text is already wrapped with the specified syntax
        const isOriginalWrapped =
            text.startsWith(before) && text.endsWith(after);

        if (isExtendedWrapped || isOriginalWrapped) {
            // Remove the wrapping syntax
            const unwrappedText = isExtendedWrapped
                ? extendedText.slice(
                      before.length,
                      extendedText.length - after.length
                  )
                : text.slice(before.length, text.length - after.length);

            // Delete the extended or original text
            Transforms.delete(editor, {
                at: isExtendedWrapped ? extendedRange : selection,
            });

            // Insert the unwrapped text
            Transforms.insertText(editor, unwrappedText, {
                at: isExtendedWrapped ? extendedStart : start,
            });

            // Adjust the selection to cover the newly inserted text
            Transforms.select(editor, {
                anchor: {
                    path: isExtendedWrapped ? extendedStart.path : start.path,
                    offset: isExtendedWrapped
                        ? extendedStart.offset
                        : start.offset,
                },
                focus: {
                    path: isExtendedWrapped ? extendedStart.path : start.path,
                    offset:
                        (isExtendedWrapped
                            ? extendedStart.offset
                            : start.offset) + unwrappedText.length,
                },
            });
        } else {
            // Delete the selected text
            Transforms.delete(editor, { at: selection });

            // Insert the wrapped text
            Transforms.insertText(editor, before + text + after, { at: start });

            // Adjust the selection to cover the newly inserted text
            Transforms.select(editor, {
                anchor: {
                    path: start.path,
                    offset: start.offset + before.length,
                },
                focus: {
                    path: start.path,
                    offset: start.offset + before.length + text.length,
                },
            });
        }
    }
};

export const isBlockActive = (editor: Editor, block: string) => {
    const [match] = Editor.nodes(editor, {
        match: (n) => Element.isElement(n) && n.type === block,
    });

    return !!match;
};

export const toggleBlockquote = (editor: Editor) => {
    const isActive = isBlockActive(editor, "blockquote");
    console.log(isActive);
    Transforms.setNodes(
        editor,
        { type: isActive ? "paragraph" : "blockquote" },
        {
            match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
        }
    );
};

export const insertEmoji = (editor: Editor, emoji: any) => {
    if (!emoji.url && emoji.emoji) {
        const { emoji: unicode } = emoji;
        const url = twemoji
            .parse(unicode, {
                folder: "svg",
                ext: ".svg",
            })
            .split('src="')[1]
            .replace('"/>', "");

        emoji.url = url;
    }
    const moji: EmojiElement = {
        type: "emoji",
        id: emoji.id || emoji.key,
        name: emoji.name || emoji.key,
        url: emoji.url,
        unicode: emoji.emoji,
        children: [{ text: "" }],
    };

    const { selection } = editor;

    if (selection) {
        Transforms.insertNodes(editor, moji);
        const pointAfterEmoji = Editor.after(editor, editor.selection!.focus);
        Transforms.select(editor, pointAfterEmoji!);
    }
};
