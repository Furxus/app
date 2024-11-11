import Popper from "@mui/material/Popper";
import IconButton from "@mui/material/IconButton";
import { useState, useRef } from "react";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data/sets/15/twitter.json";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { FaSmile } from "react-icons/fa";
import { useAuth, useUserEmojis } from "@/hooks";

interface EmojiPickerProps {
    onChange: (value: any) => void;
}

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
    const { user } = useAuth();
    const { emojis } = useUserEmojis();
    const anchorRef = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);

    const handleClick = (event: any) => {
        event?.stopPropagation();
        setOpen((prev) => !prev);
    };

    const mappedEmojis = emojis.map((emoji) => ({
        id: emoji.name,
        name: emoji.name,
        keywords: [emoji.shortCode],
        skins: [{ src: emoji.url }],
    }));

    const userEmojis = [
        {
            id: user.id,
            name: `${user.displayName ?? user.username}'s Emojis`,
            emojis: mappedEmojis,
        },
    ];

    return (
        <>
            <IconButton ref={anchorRef} onClick={handleClick}>
                <FaSmile />
            </IconButton>
            <ClickAwayListener onClickAway={() => setOpen(false)}>
                <Popper
                    anchorEl={anchorRef.current}
                    open={open}
                    placement="top-end"
                >
                    <Picker
                        data={data}
                        onEmojiSelect={(emoji: any) => onChange(emoji)}
                        set="twitter"
                        skinTonePosition="none"
                        custom={userEmojis}
                    />
                </Popper>
            </ClickAwayListener>
        </>
    );
};

export default EmojiPicker;
