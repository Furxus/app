import { useAppMode, useAuth } from "@/hooks";
import { Avatar, Stack, Typography } from "@mui/material";
import { useState } from "react";
import AvatarEditor from "../avatar/AvatarEditor";

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
                        color={appMode === "servers" ? "success" : "primary"}
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
