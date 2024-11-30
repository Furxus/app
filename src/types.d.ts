import { Descendant, BaseEditor, BaseRange, Range, Element } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

export type CustomText = {
    bold?: boolean;
    italic?: boolean;
    underlined?: boolean;
    strike?: boolean;
    code?: boolean;
    text: string;
};

export type EmptyText = {
    text: string;
};

export type ParagraphElement = {
    type: "paragraph";
    children: Descendant[];
};

export type HeadingElement = {
    type: "heading-one" | "heading-two" | "heading-three";
    children: Descendant[];
};

export type BlockQuoteElement = {
    type: "blockquote";
    children: Descendant[];
};

export type EmojiElement = {
    type: "emoji";
    id: string;
    name: string;
    url: string;
    unicode?: string;
    children: EmptyText[];
};

type CustomElement =
    | ParagraphElement
    | HeadingElement
    | BlockQuoteElement
    | EmojiElement;

export type CustomEditor = BaseEditor &
    ReactEditor &
    HistoryEditor & {
        nodeToDecorations?: Map<Element, Range[]>;
    };

declare module "slate" {
    interface CustomTypes {
        Editor: CustomEditor;
        Element: CustomElement;
        Text: CustomText;
        Range: BaseRange & {
            [key: string]: any;
        };
    }
}
