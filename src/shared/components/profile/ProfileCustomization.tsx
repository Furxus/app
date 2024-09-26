import { useAuth } from "@/hooks";
import { Avatar, Stack, Typography } from "@mui/material";

const ProfileCustomization = () => {
    const { user } = useAuth();

    return (
        <Stack justifyContent="center" alignItems="center">
            <Stack className="bg-neutral-700 p-4 rounded-lg">
                <Stack direction="row" gap={1}>
                    <Avatar
                        src={user.avatar ?? user.defaultAvatar}
                        sx={{ width: 128, height: 128 }}
                    />
                </Stack>
            </Stack>
        </Stack>
    );
};

export default ProfileCustomization;
