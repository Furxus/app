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

import twemojiUtil from "twemoji";
import { emojis as twemojis } from "@emoji-mart/data/sets/15/twitter.json";

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
            const twemoji: any =
                twemojis[emoji.name as keyof typeof twemojis] || emoji;

            let image = "";

            if (twemoji.fallbackImage) {
                const twemojiParse = twemojiUtil.parse(twemoji.emoji, {
                    base: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/15.1.0/",
                    ext: ".svg",
                    folder: "svg",
                });

                image = twemojiParse.split('src="')[1].split('"')[0];
            }

            if (twemoji.skins) {
                const skin = twemoji.skins[0];

                const twemojiParse = twemojiUtil.parse(skin.native, {
                    base: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/15.1.0/",
                    ext: ".svg",
                    folder: "svg",
                });

                image = twemojiParse.split('src="')[1].split('"')[0];
            }

            return {
                ...emoji,
                fallbackImage: image,
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
