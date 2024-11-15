import IconButton from "@mui/material/IconButton";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data/sets/15/twitter.json";
import Tippy from "@tippyjs/react";
import { FaSmile } from "react-icons/fa";
import { useAuth, useUserEmojis } from "@/hooks";

interface EmojiPickerProps {
    onChange: (value: any) => void;
}

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
    const { user } = useAuth();
    const { emojis } = useUserEmojis();

    const mappedEmojis = emojis.map((emoji) => ({
        id: emoji.id,
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
        <Tippy
            content={
                <Picker
                    data={data}
                    onEmojiSelect={(emoji: any) => onChange(emoji)}
                    set="twitter"
                    skinTonePosition="search"
                    custom={userEmojis}
                    emojiSize={36}
                    emojiButtonSize={42}
                />
            }
            interactive
            trigger="click"
            appendTo="parent"
            placement="top-start"
            animation="fade"
            offset={[-60, 10]}
        >
            <IconButton>
                <FaSmile />
            </IconButton>
        </Tippy>
    );
};

export default EmojiPicker;
