import { useAppMode } from "@/hooks";
import { ProfileSettingsPages } from "@/utils";
import { IconButton, Modal, Stack, Typography } from "@mui/material";
import classNames from "classnames";
import { Dispatch, SetStateAction, useState } from "react";

import ProfileCustomization from "./ProfileCustomization";
import AccountSettings from "./AccountSettings";
import ProfileSidebar from "./ProfileSidebar";
import { MdClose } from "react-icons/md";

const ProfileSettings = ({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    const { appMode } = useAppMode();
    const [currentPage, setCurrentPage] =
        useState<ProfileSettingsPages>("profile");

    return (
        <Modal
            onClose={(_, reason) =>
                reason === "escapeKeyDown" && setOpen(false)
            }
            className="flex items-center justify-center"
            open={open}
        >
            <Stack
                direction="column"
                className={classNames(
                    "bg-neutral-900 border rounded-lg h-3/4 w-2/4",
                    {
                        "border-green-500/60": appMode === "servers",
                        "border-blue-500/60": appMode === "posts",
                    }
                )}
            >
                <Stack direction="row" className="h-full">
                    <ProfileSidebar
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                    <Stack className="bg-neutral-800 w-full p-4">
                        <Stack
                            alignItems="flex-end"
                            justifyContent="center"
                            gap={0.25}
                        >
                            <IconButton
                                className={classNames("border", {
                                    "border-green-500": appMode === "servers",
                                    "border-blue-500": appMode === "posts",
                                })}
                                sx={{
                                    border: "1px solid",
                                }}
                                onClick={() => setOpen(false)}
                            >
                                <MdClose />
                            </IconButton>
                            <Typography variant="body1">Esc</Typography>
                        </Stack>
                        {currentPage === "profile" && <ProfileCustomization />}
                        {currentPage === "account" && <AccountSettings />}
                    </Stack>
                </Stack>
            </Stack>
        </Modal>
    );
};

export default ProfileSettings;
