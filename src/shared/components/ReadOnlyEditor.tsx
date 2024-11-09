import { EditorContent, useEditor } from "@tiptap/react";
import { extensions } from "../FurxusEditor";
import { useEffect } from "react";
import Link from "@tiptap/extension-link";
import classNames from "classnames";

const ReadOnlyEditor = ({ content }: { content: any }) => {
    const editor = useEditor({
        extensions: [...extensions, Link],
        content,
        editable: false,
        editorProps: {
            attributes: {
                class: classNames(
                    "prose dark:prose-invert max-w-none [&_ol]:list-decimal [&_ul]:list-disc"
                ),
            },
        },
    });

    useEffect(() => {
        return () => {
            if (editor) {
                editor.destroy();
            }
        };
    }, [editor]);

    return <EditorContent className="message" editor={editor} />;
};

export default ReadOnlyEditor;
