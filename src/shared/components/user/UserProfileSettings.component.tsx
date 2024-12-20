import { ProfileSettingsPages } from "@/utils";
import classNames from "classnames";
import { Dispatch, SetStateAction, useState } from "react";

import ProfileCustomization from "./UserProfileCustomization.component";
import AccountSettings from "./UserAccountSettings.component";
import ProfileSidebar from "./UserProfileSidebar.component";
import { MdClose } from "react-icons/md";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import UserEmojis from "./UserEmojis.component";
import { useAppStore } from "@/hooks/useAppStore";
import { observer } from "mobx-react-lite";

const ProfileSettings = ({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    const { appMode } = useAppStore();
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
                        "border-blue-500/60": appMode.current === "posts",
                        "border-green-500/60": appMode.current === "servers",
                        "border-[#367588]/60": appMode.current === "dms",
                    }
                )}
            >
                <Stack direction="row" className="h-full">
                    <ProfileSidebar
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                    <Stack className="bg-neutral-800 w-full p-4" gap={1}>
                        <Stack
                            alignItems="center"
                            alignSelf="flex-end"
                            justifyContent="center"
                            gap={0.25}
                        >
                            <IconButton
                                className={classNames("border", {
                                    "border-green-500":
                                        appMode.current === "servers",
                                    "border-blue-500":
                                        appMode.current === "posts",
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
                        {currentPage === "emojis" && <UserEmojis />}
                    </Stack>
                </Stack>
            </Stack>
        </Modal>
    );
};

export default observer(ProfileSettings);
