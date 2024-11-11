import Popper from "@mui/material/Popper";
import IconButton from "@mui/material/IconButton";
import { useState, MouseEvent } from "react";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data/sets/15/twitter.json";

interface EmojiPickerProps {
    onChange: (value: any) => void;
}

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setOpen((prev) => !prev);
    };

    return (
        <>
            <IconButton onClick={handleClick}>
                <span role="img" aria-label="emoji">
                    😀
                </span>
            </IconButton>
            <Popper anchorEl={anchorEl} open={open} placement="top-end">
                <Picker
                    data={data}
                    onEmojiSelect={(emoji: any) => onChange(emoji)}
                    set="twitter"
                />
            </Popper>
        </>
    );
};

export default EmojiPicker;
