import Button from "@mui/material/Button";
import classNames from "classnames";
import { Dispatch, SetStateAction, useState } from "react";
import AvatarEditor from "react-avatar-edit";
import { useAuth } from "@/hooks";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import Avatar from "@/shared/components/avatar/Avatar.component";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import { useAppStore } from "@/hooks/useAppStore";
import { observer } from "mobx-react-lite";

const AvatarUpload = ({
    setMainOpen,
}: {
    setMainOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    const { appMode } = useAppStore();
    const { user } = useAuth();

    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [editedFile, setEditedFile] = useState<File | null>(null);

    const [error, setError] = useState<string | null>(null);

    const { mutate: updateAvatar, isPending } = useMutation({
        mutationKey: ["updateAvatar"],
        mutationFn: (avatar: any) =>
            api.patch(
                "/@me",
                { avatar },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            ),
        onSuccess: () => {
            setOpen(false);
            setFile(null);
            setMainOpen(false);
        },
    });

    const onUpload = async (file: any) => {
        if (typeof file === "string")
            file = await fetch(file).then((res) => res.blob());
        setFile(file);
    };

    const onCrop = async (file: any) => {
        if (typeof file === "string")
            file = await fetch(file).then((res) => res.blob());

        setEditedFile(file);
    };

    const onClear = () => {
        setFile(null);
        setEditedFile(null);
        setError(null);
    };

    const onClose = () => {
        setFile(null);
        setError(null);
        setOpen(false);
    };

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                size="small"
                variant="outlined"
                color={
                    appMode.current === "servers" || appMode.current === "dms"
                        ? "success"
                        : "primary"
                }
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
                            "border-green-500/60":
                                appMode.current === "servers",
                            "border-blue-500/60": appMode.current === "posts",
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
                        <AvatarEditor
                            width={256}
                            height={256}
                            imageWidth={256}
                            label={
                                <Avatar
                                    src={user.avatar ?? user.defaultAvatar}
                                    sx={{ width: 256, height: 256 }}
                                />
                            }
                            onFileLoad={onUpload}
                            onClose={onClear}
                            onCrop={onCrop}
                            borderStyle={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            mimeTypes="image/*"
                        />
                        <span className="text-red-500 text-sm">
                            {error ?? ""}
                        </span>
                        <span className="text-white text-sm">
                            Click to upload
                        </span>
                    </Stack>
                    <Stack direction="row" gap={1}>
                        <Button
                            onClick={() => updateAvatar(editedFile)}
                            variant="contained"
                            color="success"
                            disabled={isPending}
                        >
                            Save
                        </Button>
                        {file && (
                            <Button
                                onClick={() => updateAvatar(file)}
                                variant="outlined"
                                disabled={isPending}
                            >
                                Skip
                            </Button>
                        )}
                        <Button
                            color="error"
                            onClick={onClose}
                            variant="outlined"
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Stack>
            </Modal>
        </>
    );
};

export default observer(AvatarUpload);
