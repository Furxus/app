import { useAppMode, useAuth } from "@/hooks";
import { Colors, ProfileSettingsPages } from "@/utils";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
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
                "border-r border-green-500/60":
                    appMode === "servers" || appMode === "dms",
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
            <Button
                sx={{
                    color: appMode === "posts" ? Colors.posts : Colors.servers,
                    borderRightColor:
                        appMode === "posts" ? Colors.posts : Colors.servers,
                    borderRight:
                        currentPage === "emojis" ? "2px solid" : "none",
                }}
                variant="text"
                onClick={() => setCurrentPage("emojis")}
                className="w-full"
                size="large"
            >
                Emojis
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
