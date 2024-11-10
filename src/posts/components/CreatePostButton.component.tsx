import { useState } from "react";

import { MuiFileInput } from "mui-file-input";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

const CreatePostButton = () => {
    const [visible, setvisible] = useState(false);

    const [text, setText] = useState<string | null>(null);
    const [media, setMedia] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    // const [createPost, { loading }] = useMutation(CreatePost, {
    //     variables: { text, media },
    //     onCompleted: () => {
    //         setError(null);
    //         closeModal();
    //     },
    //     onError: (error) => {
    //         const err = error.message.includes("size limit")
    //             ? "File too large, maximum file size is 25MB"
    //             : error.message;
    //         setError(err);
    //     },
    // });

    const closeModal = () => {
        setvisible(false);
        setText(null);
        setMedia(null);
        setError(null);
    };

    return (
        <>
            <Button
                variant="contained"
                color="success"
                onClick={() => setvisible(true)}
            >
                Create Post
            </Button>
            <Dialog
                open={visible}
                onClose={closeModal}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        //createPost();
                    }
                }}
            >
                <DialogTitle className="flex justify-between">
                    Create a post
                </DialogTitle>
                <DialogContent className="flex flex-col gap-4 justify-center items-center">
                    <div className="flex flex-col justify-center items-start gap-4">
                        <MuiFileInput
                            inputProps={{
                                accept: "image/*, video/*, audio/*",
                            }}
                            label="Upload media"
                            placeholder="No file selected"
                            onChange={(file) => setMedia(file)}
                            className="w-48 text-ellipsis gap-4"
                            value={media}
                            error={!!error}
                        />
                        <Stack gap={4}>
                            <TextField
                                label="Text"
                                onChange={(e) => setText(e.target.value)}
                                name="text"
                                className="mb-4"
                                value={text ?? ""}
                                multiline
                                error={!!error}
                                helperText={error}
                            />
                        </Stack>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <Button
                            //onClick={() => createPost()}
                            color="success"
                            size="medium"
                            variant="contained"
                            //disabled={loading}
                        >
                            Submit
                        </Button>
                        <Button
                            color="error"
                            variant="text"
                            // disabled={loading}
                            onClick={closeModal}
                        >
                            Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CreatePostButton;
