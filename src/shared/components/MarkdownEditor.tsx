import { useState } from "react";
import {
    Editor,
    EditorState,
    ContentState,
    CompositeDecorator,
} from "draft-js";
import "draft-js/dist/Draft.css"; // You can choose a different theme

import { emojis as emojisData } from "@emoji-mart/data/sets/15/twitter.json";

const createMarkdownStrategy =
    (regex: any) => (contentBlock: any, callback: any) => {
        const text = contentBlock.getText();
        let matchArr, start, end;

        // Find regex matches
        while ((matchArr = regex.exec(text)) !== null) {
            start = matchArr.index;
            end = start + matchArr[0].length;
            callback(start, end);
        }
    };

const MarkdownSpan = ({ children, style, className }: any) => (
    <span className={className} style={style}>
        {children}
    </span>
);

const MarkdownEditor = () => {
    const createDecorator = () =>
        new CompositeDecorator([
            {
                strategy: createMarkdownStrategy(/\*\*(.*?)\*\*/g), // Bold: **text**
                component: (props) => (
                    <MarkdownSpan {...props} className="font-bold" />
                ),
            },
            {
                strategy: createMarkdownStrategy(/\*(.*?)\*/g), // Italic: *text*
                component: (props) => (
                    <MarkdownSpan {...props} className="italic" />
                ),
            },
            {
                strategy: createMarkdownStrategy(/^# (.*?)(\n|$)/g), // Headings: # Heading
                component: (props) => (
                    <MarkdownSpan {...props} className="text-3xl font-bold" />
                ),
            },
            {
                strategy: createMarkdownStrategy(/^## (.*?)(\n|$)/g), // Headings: ## Heading
                component: (props) => (
                    <MarkdownSpan {...props} className="text-2xl font-bold" />
                ),
            },
            {
                strategy: createMarkdownStrategy(/^### (.*?)(\n|$)/g), // Headings: ### Heading
                component: (props) => (
                    <MarkdownSpan {...props} className="text-xl font-bold" />
                ),
            },

            {
                strategy: createMarkdownStrategy(/`([^`]+)`/g), // Inline code: `code`
                component: (props) => (
                    <MarkdownSpan
                        {...props}
                        className="font-mono bg-neutral-700 border border-green-500/60"
                    />
                ),
            },
            {
                strategy: createMarkdownStrategy(/~~(.*?)~~/g),
                component: (props) => (
                    <MarkdownSpan className="line-through" {...props} />
                ),
            },
            {
                strategy: createMarkdownStrategy(/> (.*?)(\n|$)/g),
                component: (props) => (
                    <MarkdownSpan
                        {...props}
                        className="block italic border-l-4 border-neutral-500"
                    />
                ),
            },
        ]);

    const [editorState, setEditorState] = useState(() =>
        EditorState.createWithContent(
            ContentState.createFromText(
                `# Heading 1\n## Heading 2\n### Heading 3\n\n> This is a blockquote!\n\n\`\`\`javascript\nconst x = 10;\nconsole.log(x);\n\`\`\`\n\nType **bold**, *italic*, or \`code\`!\n\n:joy:`
            ),
            createDecorator()
        )
    );

    const handleEditorChage = (editorState: any) => {
        setEditorState(editorState);
    };

    return (
        <div className="w-full border p-2">
            <Editor editorState={editorState} onChange={handleEditorChage} />
        </div>
    );
};

export { MarkdownEditor };
