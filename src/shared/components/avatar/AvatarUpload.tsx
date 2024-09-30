import Button from "@mui/material/Button";
import classNames from "classnames";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import AvatarEditor from "react-avatar-edit";
import { useAppMode, useAuth } from "@/hooks";
import { useMutation } from "@apollo/client";
import { UpdateAvatar } from "@/gql/auth";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import Avatar from "@mui/material/Avatar";

const AvatarUpload = () => {
    const { appMode } = useAppMode();
    const { user, refresh } = useAuth();

    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);

    const [updateAvatar, { loading }] = useMutation(UpdateAvatar, {
        variables: {
            avatar: file,
        },
        update: () => {
            setOpen(false);
            setFile(null);
            setThumbnail(null);
            refresh();
        },
    });

    const onUpload = (file: any) => {
        setFile(file);
        setThumbnail(URL.createObjectURL(file));
    };

    const onClose = () => {
        setFile(null);
        setThumbnail(null);
        setError(null);
        setOpen(false);
    };

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                size="small"
                variant="outlined"
            >
                Upload
            </Button>
            <Modal
                open={open}
                onClose={onClose}
                className="flex justify-center items-center"
            >
                <Stack
                    direction="column"
                    gap={2}
                    className={classNames(
                        "bg-neutral-900 border rounded-lg p-4",
                        {
                            "border-green-500/60": appMode === "servers",
                            "border-blue-500/60": appMode === "posts",
                        }
                    )}
                    justifyContent="center"
                    alignItems="center"
                >
                    <Stack
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                        gap={0.5}
                    >
                        {thumbnail ? (
                            <div className="relative">
                                {!loading && (
                                    <MdClose
                                        className="absolute top-0 right-0"
                                        onClick={() => setThumbnail(null)}
                                    />
                                )}
                                <img
                                    className="w-[96px] h-[96px] rounded-full"
                                    src={thumbnail}
                                    alt="thumbnail"
                                />
                            </div>
                        ) : (
                            <AvatarEditor
                                width={96}
                                height={96}
                                label={
                                    <Avatar
                                        src={user.avatar ?? user.defaultAvatar}
                                        sx={{ width: 96, height: 96 }}
                                    />
                                }
                                onFileLoad={onUpload}
                                onClose={onClose}
                                borderStyle={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                mimeTypes="image/*"
                            />
                        )}
                        <span className="text-red-500 text-sm">
                            {error ?? ""}
                        </span>
                        <span className="text-white text-sm">
                            Click to upload
                        </span>
                    </Stack>
                    <Stack direction="row" gap={1}>
                        <Button
                            onClick={() => updateAvatar()}
                            variant="contained"
                            color="success"
                            disabled={loading}
                        >
                            Save
                        </Button>
                        <Button
                            color="error"
                            onClick={onClose}
                            variant="outlined"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Stack>
            </Modal>
        </>
    );
};

export default AvatarUpload;
