import { Stack } from "@mui/material";
import Avatar from "@/shared/components/avatar/Avatar";

const APILoading = () => {
    return (
        <Stack justifyContent="center" alignItems="center" className="h-dvh">
            <Avatar src="/logo-animated.gif" sx={{ width: 128, height: 128 }} />
        </Stack>
    );
};

export default APILoading;
