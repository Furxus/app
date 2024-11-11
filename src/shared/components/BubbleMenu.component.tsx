import Stack from "@mui/material/Stack";
import { BubbleMenu as TMenu, Editor } from "@tiptap/react";

import IconButton from "@mui/material/IconButton";
import { FaBold, FaItalic, FaStrikethrough } from "react-icons/fa";
import classNames from "classnames";
import Divider from "@mui/material/Divider";
import PopoverPicker from "./PopoverPicker.component";
import { useState } from "react";

const BubbleMenu = ({ editor }: { editor: Editor }) => {
    const [color, setColor] = useState("#fff");

    const onChange = (color: string) => {
        editor.chain().focus().setColor(color).run();
        setColor(color);
    };

    const onReset = () => {
        editor.chain().focus().unsetColor().run();
        setColor("#fff");
    };

    return (
        <TMenu
            className="bg-neutral-700 p-2 rounded-lg"
            editor={editor}
            tippyOptions={{
                placement: "top",
                offset: [0, 20],
            }}
        >
            <Stack direction="row" spacing={1}>
                <IconButton
                    size="small"
                    className={classNames("rounded-sm", {
                        "bg-neutral-800": editor.isActive("bold"),
                    })}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <FaBold />
                </IconButton>
                <IconButton
                    size="small"
                    className={classNames("rounded-sm", {
                        "bg-neutral-800": editor.isActive("italic"),
                    })}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <FaItalic />
                </IconButton>
                <IconButton
                    size="small"
                    className={classNames("rounded-sm", {
                        "bg-neutral-800": editor.isActive("strike"),
                    })}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                    <FaStrikethrough />
                </IconButton>
                <Divider orientation="vertical" flexItem />
                <Stack
                    direction="row"
                    gap={0.5}
                    justifyContent="center"
                    alignItems="center"
                >
                    <PopoverPicker color={color} onChange={onChange} />
                    <IconButton
                        size="small"
                        className="rounded-sm"
                        onClick={() => onReset()}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </IconButton>
                </Stack>
            </Stack>
        </TMenu>
    );
};

export default BubbleMenu;
