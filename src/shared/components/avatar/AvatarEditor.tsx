import { useAppMode, useAuth } from "@/hooks";
import { Avatar, Button, Modal, Stack } from "@mui/material";
import classNames from "classnames";
import { Dispatch, SetStateAction } from "react";
import AvatarDraw from "./AvatarDraw";
import DefaultAvatars from "./DefaultAvatars";

const AvatarEditor = ({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    const { appMode } = useAppMode();
    const { user } = useAuth();

    return (
        <Modal
            className="flex items-center justify-center"
            open={open}
            onClose={() => setOpen(false)}
        >
            <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                gap={1.5}
                className={classNames("bg-neutral-900 border rounded-lg p-4", {
                    "border-green-500/60": appMode === "servers",
                    "border-blue-500/60": appMode === "posts",
                })}
            >
                <Avatar
                    src={user.avatar ?? user.defaultAvatar}
                    sx={{ width: 72, height: 72 }}
                />
                <Stack direction="row" gap={1}>
                    <DefaultAvatars />
                    <Button size="small" variant="outlined">
                        Upload
                    </Button>
                    <AvatarDraw />
                </Stack>
            </Stack>
        </Modal>
    );
};

export default AvatarEditor;
