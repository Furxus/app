import { useState } from "react";

import { MuiFileInput } from "mui-file-input";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

const CreatePostButton = () => {
    const [visible, setVisible] = useState(false);

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
        setVisible(false);
        setText(null);
        setMedia(null);
        setError(null);
    };

    return (
        <>
            <Button
                variant="contained"
                color="success"
                onClick={() => setVisible(true)}
            >
                Create Post
            </Button>
            <Modal
                className="flex items-center justify-center"
                open={visible}
                onClose={() => closeModal()}
            >
                <Stack
                    direction="column"
                    p={4}
                    gap={2}
                    alignItems="center"
                    className="bg-neutral-900 border rounded-lg w-1/5 border-blue-500/60"
                >
                    <Typography variant="h6">Create a post</Typography>
                    <Stack direction="column" gap={2} alignItems="center">
                        <MuiFileInput
                            inputProps={{
                                accept: "image/*, video/*, audio/*",
                            }}
                            label="Upload media"
                            placeholder="No file selected"
                            onChange={(file) => setMedia(file)}
                            className="text-ellipsis"
                            value={media}
                            error={!!error}
                        />
                        <TextField
                            label="Text"
                            onChange={(e) => setText(e.target.value)}
                            name="text"
                            fullWidth
                            className="mb-4"
                            value={text ?? ""}
                            multiline
                            error={!!error}
                            helperText={error}
                        />
                        <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            gap={2}
                        >
                            <Button
                                //onClick={() => createPost()}
                                color="success"
                                variant="contained"
                                //disabled={loading}
                            >
                                Submit
                            </Button>
                            <Button
                                color="error"
                                variant="outlined"
                                // disabled={loading}
                                onClick={closeModal}
                            >
                                Cancel
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
            </Modal>
        </>
    );

    /* return (
        <>
            <Button
                variant="contained"
                color="success"
                onClick={() => setVisible(true)}
            >
                Create Post
            </Button>
            <Dialog open={visible} onClose={closeModal}>
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
    );*/
};

export default CreatePostButton;
