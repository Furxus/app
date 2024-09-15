import { Dispatch, SetStateAction } from "react";
import { useAuth } from "../../hooks";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import DialogContent from "@mui/material/DialogContent";

const SidebarProfileSettings = ({
    showSettings,
    setShowSettings,
}: {
    showSettings: boolean;
    setShowSettings: Dispatch<SetStateAction<boolean>>;
}) => {
    const { user } = useAuth();

    const onClose = () => {
        setShowSettings(false);
    };

    return (
        <Dialog open={showSettings} onClose={onClose}>
            <DialogTitle>
                <Stack alignItems="center" justifyContent="center" gap="xs">
                    <Avatar src={user.avatar ?? user.defaultAvatar}>
                        {user.nameAcronym}
                    </Avatar>
                    <span>Profile Settings</span>
                </Stack>
            </DialogTitle>
            <DialogContent>
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                ></Stack>
            </DialogContent>
            w
        </Dialog>
    );
};

export default SidebarProfileSettings;
