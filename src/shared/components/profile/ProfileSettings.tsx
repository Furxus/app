import { useAppMode } from "@/hooks";
import { ProfileSettingsPages } from "@/utils";
import { IconButton, Modal, Stack } from "@mui/material";
import classNames from "classnames";
import { Dispatch, SetStateAction, useState } from "react";

import ProfileCustomization from "./Customization";
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
                <Stack
                    direction="row"
                    justifyContent="center"
                    className="h-full"
                >
                    <ProfileSidebar setCurrentPage={setCurrentPage} />
                    <Stack className="bg-neutral-800 w-full relative p-4">
                        <Stack
                            className="absolute top-2 right-2"
                            justifyContent="center"
                            alignItems="center"
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
                            <span className="text-sm">Esc</span>
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
