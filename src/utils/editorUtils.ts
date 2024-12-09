import { Node, Text, Element, Descendant } from "slate";

export const serializeToMarkdown = (nodes: Node[]) =>
    nodes.map((node) => serializeNode(node)).join("");

const serializeNode = (node: Node): string => {
    if (Text.isText(node)) return node.text;

    if (Element.isElement(node)) {
        const children = node.children.map((n) => serializeNode(n)).join("");

        switch (node.type) {
            case "paragraph":
                return `${children}`;
            case "blockquote":
                return `> ${children}\n`;
            case "emoji":
                return `:${node.id}:`;
            case "heading-one":
                return `# ${children}\n`;
            case "heading-two":
                return `## ${children}\n`;
            case "heading-three":
                return `### ${children}\n`;
            default:
                return children;
        }
    }

    return "";
};

export const deserializeFromMarkdown = (markdown: string) => {
    const lines = markdown.split("\n");

    return lines.map((line) => deserializeLine(line));
};

export const deserializeLine = (line: string): Descendant => {
    if (line.startsWith("> ")) {
        return {
            type: "blockquote",
            children: [{ text: line.slice(2) }],
        };
    }

    if (line.startsWith("# ")) {
        return {
            type: "heading-one",
            children: [{ text: line.slice(2) }],
        };
    }

    if (line.startsWith("## ")) {
        return {
            type: "heading-two",
            children: [{ text: line.slice(3) }],
        };
    }

    if (line.startsWith("### ")) {
        return {
            type: "heading-three",
            children: [{ text: line.slice(4) }],
        };
    }

    return {
        type: "paragraph",
        children: [{ text: line }],
    };
};
