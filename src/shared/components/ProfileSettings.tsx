import { useAppMode } from "@/hooks";
import { Modal, Stack } from "@mui/material";
import classNames from "classnames";
import { Dispatch, SetStateAction } from "react";

const ProfileSettings = ({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    const { appMode } = useAppMode();

    return (
        <Modal
            className={classNames("flex items-center justify-center border", {
                "border-blue-500": appMode === "posts",
                "border-green-500": appMode === "servers",
            })}
            open={open}
            onClose={() => setOpen(false)}
        >
            <Stack direction="column" className="bg-neutral-800 p-4">
                <h1 className="text-lg font-bold">Profile Settings</h1>
            </Stack>
        </Modal>
    );
};

export default ProfileSettings;
