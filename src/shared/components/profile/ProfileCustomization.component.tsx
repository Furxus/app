import { useAppMode, useAuth } from "@/hooks";
import { useState } from "react";
import AvatarEditor from "../avatar/AvatarEditor.component";
import Stack from "@mui/material/Stack";
import Avatar from "@/shared/components/avatar/Avatar.component";
import Typography from "@mui/material/Typography";

const ProfileCustomization = () => {
    const { user } = useAuth();
    const { appMode } = useAppMode();

    const [avatarEditorVisible, setAvatarEditorVisible] = useState(false);

    return (
        <>
            <Stack justifyContent="center" alignItems="center">
                <Stack
                    className="bg-neutral-700/60 p-4 rounded-lg cursor-pointer"
                    justifyContent="center"
                    alignItems="center"
                    gap={0.5}
                    onClick={() => setAvatarEditorVisible(true)}
                >
                    <Avatar
                        src={user.avatar ?? user.defaultAvatar}
                        sx={{ width: 72, height: 72 }}
                    />
                    <Typography
                        variant="caption"
                        color={
                            appMode === "servers" || appMode === "dms"
                                ? "success"
                                : "primary"
                        }
                    >
                        Click to change
                    </Typography>
                </Stack>
            </Stack>
            {avatarEditorVisible && (
                <AvatarEditor
                    open={avatarEditorVisible}
                    setOpen={setAvatarEditorVisible}
                />
            )}
        </>
    );
};

export default ProfileCustomization;
