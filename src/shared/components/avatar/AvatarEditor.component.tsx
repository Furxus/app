import { useAuth } from "@/hooks";
import classNames from "classnames";
import { Dispatch, SetStateAction } from "react";
import AvatarDraw from "./AvatarDraw.component";
import Avatars from "./Avatars.component";
import AvatarUpload from "./AvatarUpload.component";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Avatar from "@/shared/components/avatar/Avatar.component";
import { useAppStore } from "@/hooks/useAppStore";
import { observer } from "mobx-react-lite";

const AvatarEditor = ({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    const { appMode } = useAppStore();
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
                    "border-green-500/60":
                        appMode.current === "servers" ||
                        appMode.current === "dms",
                    "border-blue-500/60": appMode.current === "posts",
                })}
            >
                <Avatar
                    src={user.avatar ?? user.defaultAvatar}
                    sx={{ width: 72, height: 72 }}
                />
                <Stack direction="row" gap={1}>
                    <Avatars setMainOpen={setOpen} />
                    <AvatarUpload setMainOpen={setOpen} />
                    <AvatarDraw setMainOpen={setOpen} />
                </Stack>
            </Stack>
        </Modal>
    );
};

export default observer(AvatarEditor);
