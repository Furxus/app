import { Node, mergeAttributes } from "@tiptap/react";
import twemoji from "twemoji";

const TwemojiExtension = Node.create({
    name: "twemoji",

    addOptions() {
        return {
            class: "twemoji",
        };
    },

    group: "inline",
    inline: true,
    selectable: false,
    atom: true,

    parseHTML() {
        return [
            {
                tag: "span.twemoji",
            },
        ];
    },

    renderHTML({ node, HTMLAttributes }) {
        const content = node.attrs.content;

        // Convert the emoji to an image
        const twemojiImage = twemoji.parse(content, {
            folder: "svg",
            ext: ".svg",
            attributes: () => ({
                class: this.options.class,
            }),
        });

        return [
            "span",
            mergeAttributes(HTMLAttributes, { class: this.options.class }),
            twemojiImage,
        ];
    },

    addAttributes() {
        return {
            content: {
                default: null,
            },
        };
    },

    addNodeView() {
        return ({ node }) => {
            const span = document.createElement("span");
            span.innerHTML = twemoji.parse(node.attrs.content, {
                folder: "svg",
                ext: ".svg",
                attributes: () => ({
                    class: this.options.class,
                }),
            });

            return {
                dom: span,
            };
        };
    },

    addProseMirrorPlugins() {
        return [];
    },
});

export default TwemojiExtension;
