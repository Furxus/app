import { IconButton } from "@mui/material";
import Popover from "@mui/material/Popover";
import { useState, MouseEvent } from "react";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data/sets/15/twitter.json";

interface EmojiPickerProps {
    onChange: (value: any) => void;
}

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton onClick={handleClick}></IconButton>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <Picker
                    data={data}
                    onEmojiSelect={(emoji: any) => onChange(emoji)}
                    set="twitter"
                />
            </Popover>
        </>
    );
};

export default EmojiPicker;
