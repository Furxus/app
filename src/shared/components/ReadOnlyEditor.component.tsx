import { EditorContent, useEditor } from "@tiptap/react";

import { useEffect } from "react";
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

    const editor = useEditor({
        extensions: [
            ...extensions,
            Link.configure({ openOnClick: true, autolink: true }),
        ],
        content,
        editable: false,
        editorProps: {
            attributes: {
                class: classNames(
                    "prose dark:prose-invert m-0 p-0 max-w-none [&_ol]:list-decimal [&_ul]:list-disc",
                    additionalClasses
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
