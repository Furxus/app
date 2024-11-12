import { EditorContent, useEditor } from "@tiptap/react";

import { useEffect, useState } from "react";
import Link from "@tiptap/extension-link";
import classNames from "classnames";
import { useEditorExtensions } from "@/hooks";

const ReadOnlyEditor = ({
    content,
    additionalClasses,
}: {
    content: any;
    additionalClasses?: string;
}) => {
    const { extensions } = useEditorExtensions();
    const [onlyEmojis, setOnlyEmojis] = useState(false);

    const editor = useEditor({
        extensions: [
            ...extensions,
            Link.configure({ openOnClick: true, autolink: true }),
        ],
        onCreate: ({ editor }) => {
            const { content } = editor.getJSON();

            console.log(content);

            const checkOnlyEmojis =
                content?.every(
                    (node) =>
                        node.content?.every(
                            (n) =>
                                n.type === "emoji" ||
                                (n.type === "text" && n.text?.trim() === "")
                        ) || node.type === "emoji"
                ) ?? false;

            console.log(checkOnlyEmojis);

            setOnlyEmojis(checkOnlyEmojis);
        },
        content,
        editable: false,
        editorProps: {
            attributes: {
                class: classNames(
                    "prose dark:prose-invert m-0 p-0 max-w-none [&_ol]:list-decimal [&_ul]:list-disc",
                    additionalClasses,
                    {
                        "text-3xl": onlyEmojis,
                    }
                ),
            },
        },
    });

    useEffect(() => {
        return () => {
            if (editor) editor.destroy();
        };
    }, [editor, content]);

    return <EditorContent className="message" editor={editor} />;
};

export default ReadOnlyEditor;
