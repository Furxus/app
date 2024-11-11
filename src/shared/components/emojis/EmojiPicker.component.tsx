import Popper from "@mui/material/Popper";
import IconButton from "@mui/material/IconButton";
import { useState, useRef } from "react";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data/sets/15/twitter.json";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { FaSmile } from "react-icons/fa";

interface EmojiPickerProps {
    onChange: (value: any) => void;
}

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
    const anchorRef = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);

    const handleClick = (event: any) => {
        event?.stopPropagation();
        setOpen((prev) => !prev);
    };

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
                    />
                </Popper>
            </ClickAwayListener>
        </>
    );
};

export default EmojiPicker;
