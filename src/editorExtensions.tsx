import Document from "@tiptap/extension-document";
import BulletList from "@tiptap/extension-bullet-list";
import CharacterCount from "@tiptap/extension-character-count";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import CodeBlockLowLight from "@tiptap/extension-code-block-lowlight";
import Emoji, { emojis } from "@tiptap-pro/extension-emoji";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import Mention from "@tiptap/extension-mention";
import Image from "@tiptap/extension-image";
import Parapgraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Markdown } from "tiptap-markdown";
import Bold from "@tiptap/extension-bold";
import Code from "@tiptap/extension-code";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { all, createLowlight } from "lowlight";

import twemoji from "twemoji";

const lowlight = createLowlight(all);

const extensions = [
    Document,
    BulletList,
    CharacterCount.configure({
        limit: 2000,
    }),
    CodeBlockLowLight.configure({
        lowlight,
    }),
    Emoji.configure({
        enableEmoticons: true,
        emojis: emojis.map((emoji) => {
            if (!emoji.emoji) return emoji;

            const twe = twemoji.parse(emoji.emoji, {
                base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/",
                folder: "svg",
                ext: ".svg",
            });

            return {
                ...emoji,
                fallbackImage: twe.split('src="')[1]?.split('"')[0],
            };
        }),
        forceFallbackImages: true,
    }),
    Image,
    Color,
    ListItem,
    OrderedList,
    HardBreak.configure({
        keepMarks: false,
    }),
    Heading.configure({ levels: [1, 2, 3] }),
    Mention,
    Parapgraph,
    Text,
    Markdown,
    Bold,
    Code,
    Highlight,
    Italic,
    Strike,
    Subscript,
    Superscript,
    TextStyle,
    Underline,
];

export { extensions };
