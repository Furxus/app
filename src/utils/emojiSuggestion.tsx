import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import shuffle from "lodash/shuffle";

import EmojiList from "@/shared/components/emojis/EmojiList";

export default {
    items: ({ editor, query }: any) =>
        shuffle(
            editor.storage.emoji.emojis.filter(
                ({ shortcodes, tags }: any) =>
                    shortcodes.find((shortcode: any) =>
                        shortcode.startsWith(query.toLowerCase())
                    ) ||
                    tags.find((tag: any) => tag.startsWith(query.toLowerCase()))
            )
        ),

    allowSpaces: false,
    render: () => {
        let component: any;
        let popup: any;

        return {
            onStart: (props: any) => {
                component = new ReactRenderer(EmojiList, {
                    props,
                    editor: props.editor,
                });

                popup = tippy(".tiptap", {
                    getReferenceClientRect: props.clientRect,
                    maxWidth: 320,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: "manual",
                    placement: "top-start",
                });
            },

            onUpdate(props: any) {
                component.updateProps(props);

                popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                });
            },

            onKeyDown(props: any) {
                if (props.event.key === "Escape") {
                    popup[0].hide();
                    component.destroy();

                    return true;
                }

                return component.ref?.onKeyDown(props);
            },

            onExit() {
                popup[0].destroy();
                component.destroy();
            },
        };
    },
};
