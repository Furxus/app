import { useUserEmojis } from "@/hooks";
import { Button, Checkbox, Stack, Typography } from "@mui/material";
import { useState } from "react";
import AddEmojiModal from "../emojis/AddEmojiModal.component";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";

const UserEmojis = () => {
    const queryClient = useQueryClient();
    const { emojis } = useUserEmojis();

    const [emojisSelected, setEmojisSelected] = useState<string[]>([]);

    const { mutate: removeEmojis } = useMutation({
        mutationKey: ["removeEmojis"],
        mutationFn: (emojis: string[]) =>
            api.delete("/@me/emojis", { data: { emojis } }),
        onSuccess: () => {
            setEmojisSelected([]);

            queryClient.invalidateQueries({
                queryKey: ["getUserEmojis"],
            });

            queryClient.invalidateQueries({
                queryKey: ["getCustomEmojis"],
            });
        },
    });

    return (
        <Stack direction="column" gap={1}>
            <Stack direction="row" gap={0.5} justifyContent="flex-start">
                <AddEmojiModal />
                <Button
                    variant="contained"
                    disabled={
                        emojisSelected.length === 0 || emojis.length === 0
                    }
                    onClick={() => removeEmojis(emojisSelected)}
                    color="inherit"
                >
                    Remove Emoji(s)
                </Button>
            </Stack>
            <Stack direction="column" gap={1}>
                {emojis.length === 0 && (
                    <Stack mt={5} justifyContent="center" alignItems="center">
                        <Typography variant="h6">No emojis?</Typography>
                        <Typography variant="body1">
                            Add some emojis to your collection!
                        </Typography>
                    </Stack>
                )}
                {emojis.length > 0 && (
                    <Typography variant="h6">Your Emojis</Typography>
                )}
                {emojis.map((emoji) => (
                    <Stack
                        key={emoji.id}
                        direction="row"
                        gap={1}
                        alignItems="center"
                    >
                        <Checkbox
                            checked={emojisSelected.includes(emoji.id)}
                            onChange={() => {
                                setEmojisSelected((prev) =>
                                    prev.includes(emoji.id)
                                        ? prev.filter((id) => id !== emoji.id)
                                        : [...prev, emoji.id]
                                );
                            }}
                        />
                        <img
                            src={emoji.url}
                            alt={emoji.name}
                            className="w-10 h-10"
                        />
                        <Typography variant="body1">{emoji.name}</Typography>
                        <Typography variant="body1">
                            :{emoji.shortCode}:
                        </Typography>
                    </Stack>
                ))}
            </Stack>
        </Stack>
    );
};

export default UserEmojis;
