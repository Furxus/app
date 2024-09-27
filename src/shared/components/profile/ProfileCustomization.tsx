import { useAuth } from "@/hooks";
import { Avatar, Stack, Typography } from "@mui/material";
import { useState } from "react";
import AvatarEditor from "../avatar/AvatarEditor";

const ProfileCustomization = () => {
    const { user } = useAuth();

    const [avatarEditorVisible, setAvatarEditorVisible] = useState(false);

    return (
        <>
            <Stack justifyContent="center" alignItems="center">
                <Stack
                    className="bg-neutral-700 p-4 rounded-lg"
                    justifyContent="center"
                    alignItems="center"
                    gap={0.5}
                >
                    <Avatar
                        className="cursor-pointer"
                        src={user.avatar ?? user.defaultAvatar}
                        sx={{ width: 72, height: 72 }}
                        onClick={() => setAvatarEditorVisible(true)}
                    />
                    <Typography variant="caption" color="textSecondary">
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
