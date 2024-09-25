import { useAppMode, useAuth } from "@/hooks";
import { Colors, ProfileSettingsPages } from "@/utils";
import { Button, Divider, Stack } from "@mui/material";
import classNames from "classnames";
import { Dispatch, SetStateAction } from "react";

const ProfileSidebar = ({
    currentPage,
    setCurrentPage,
}: {
    currentPage: ProfileSettingsPages;
    setCurrentPage: Dispatch<SetStateAction<ProfileSettingsPages>>;
}) => {
    const { appMode } = useAppMode();
    const { logout } = useAuth();

    return (
        <Stack
            direction="column"
            alignItems="center"
            gap="0.25rem"
            p={4}
            className={classNames("h-full", {
                "border-r border-blue-500/60": appMode === "posts",
                "border-r border-green-500/60": appMode === "servers",
            })}
        >
            <Button
                variant="text"
                sx={{
                    color: appMode === "posts" ? Colors.posts : Colors.servers,
                    borderRightColor:
                        appMode === "posts" ? Colors.posts : Colors.servers,
                    borderRight: currentPage === "profile" ? "2px solid" : null,
                }}
                onClick={() => setCurrentPage("profile")}
                className="w-full"
                size="large"
            >
                Profile
            </Button>
            <Button
                sx={{
                    color: appMode === "posts" ? Colors.posts : Colors.servers,
                    borderRightColor:
                        appMode === "posts" ? Colors.posts : Colors.servers,
                    borderRight:
                        currentPage === "account" ? "2px solid" : "none",
                }}
                variant="text"
                onClick={() => setCurrentPage("account")}
                className="w-full"
                size="large"
            >
                Account
            </Button>
            <Divider
                flexItem
                sx={{
                    background:
                        appMode === "posts" ? Colors.posts : Colors.servers,
                    marginTop: "1rem",
                }}
            />
            <Button
                sx={{
                    color: appMode === "posts" ? Colors.posts : Colors.servers,
                }}
                variant="text"
                onClick={() => logout()}
            >
                Logout
            </Button>
        </Stack>
    );
};

export default ProfileSidebar;
