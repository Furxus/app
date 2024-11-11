import { api } from "@/api";
import { Avatar, Box, Modal, Stack, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import AvatarEditor from "react-avatar-edit";
import { MdClose } from "react-icons/md";

const AddEmojiModal = () => {
    const queryClient = useQueryClient();
    const [visible, setVisible] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { mutate, isPending } = useMutation({
        mutationKey: ["addEmoji"],
        mutationFn: (values: any) =>
            api
                .put("/@me/emojis", values, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["getUserEmojis"],
            });

            queryClient.invalidateQueries({
                queryKey: ["getCustomEmojis"],
            });

            closeModal();
        },
    });

    const closeModal = () => {
        setVisible(false);
        setTimeout(() => {
            setName("");
            setFile(null);
            setThumbnail(null);
            setError(null);
        }, 1000);
    };

    const onChange = (e: any) => {
        setName(e.target.value);
    };

    const onUpload = (file: any) => {
        setFile(file);
        setThumbnail(URL.createObjectURL(file));
    };

    const onClose = () => {
        setFile(null);
        setThumbnail(null);
    };

    const onSubmit = () => {
        if (!file) {
            setError("Please select an image to upload.");
            return;
        }

        if (name.length < 2) {
            setError("Emoji name must be at least 2 characters.");
            return;
        }

        mutate({
            name,
            emoji: file,
        });
    };

    return (
        <>
            <Button
                onClick={() => setVisible(true)}
                variant="contained"
                color="inherit"
            >
                Add Emoji
            </Button>
            <Modal
                open={visible}
                onClose={closeModal}
                className="flex items-center justify-center"
            >
                <Stack
                    p={4}
                    gap={2}
                    direction="column"
                    alignItems="center"
                    className="bg-neutral-900 border rounded-lg w-1/4 border-green-500/60"
                >
                    <Stack direction="row" gap={2} alignItems="center">
                        {thumbnail ? (
                            <Box position="relative">
                                <MdClose
                                    className="absolute top-[-15px] right-[-10px] cursor-pointer"
                                    onClick={() => onClose()}
                                />
                                <Avatar
                                    src={thumbnail}
                                    alt="thumbnail"
                                    sx={{
                                        width: 96,
                                        height: 96,
                                    }}
                                    variant="square"
                                />
                            </Box>
                        ) : (
                            <AvatarEditor
                                width={96}
                                height={96}
                                label={
                                    <div className="text-white text-sm flex flex-col items-center">
                                        <span>Upload</span>
                                    </div>
                                }
                                onFileLoad={onUpload}
                                onClose={onClose}
                                borderStyle={{
                                    border: "dashed 1px #ccc",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                mimeTypes="image/*"
                            />
                        )}
                        <Stack direction="column">
                            <TextField
                                label="Emoji Name"
                                error={!!error}
                                name="name"
                                value={name}
                                onChange={onChange}
                                className="mb-4"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && name) onSubmit();
                                }}
                            />
                            <Button
                                onClick={onSubmit}
                                variant="contained"
                                color="success"
                                disabled={isPending || !!error || !name}
                            >
                                Add
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
            </Modal>
        </>
    );
};

export default AddEmojiModal;
