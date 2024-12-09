import { useAuth } from "@/hooks";
import { useAppStore } from "@/hooks/useAppStore";
import { Colors, ProfileSettingsPages } from "@/utils";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { Dispatch, SetStateAction } from "react";

const ProfileSidebar = ({
    currentPage,
    setCurrentPage,
}: {
    currentPage: ProfileSettingsPages;
    setCurrentPage: Dispatch<SetStateAction<ProfileSettingsPages>>;
}) => {
    const { appMode } = useAppStore();
    const { logout } = useAuth();

    let color = Colors.dms;

    switch (appMode.current) {
        case "posts":
            color = Colors.posts;
            break;
        case "servers":
            color = Colors.servers;
            break;
        case "dms":
            color = Colors.dms;
            break;
    }

    return (
        <Stack
            direction="column"
            alignItems="center"
            gap="0.25rem"
            p={4}
            className={classNames("h-full", {
                "border-blue-500/60": appMode.current === "posts",
                "border-green-500/60": appMode.current === "servers",
                "border-[#367588]/60": appMode.current === "dms",
            })}
        >
            <Button
                variant="text"
                sx={{
                    color,
                    borderRightColor: color,
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
                    color: color,
                    borderRightColor: color,
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
                    color: color,
                    borderRightColor: color,
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
                    background: color,
                }}
            />
            <Button
                sx={{
                    color: color,
                }}
                variant="text"
                onClick={() => logout()}
            >
                Logout
            </Button>
        </Stack>
    );
};

export default observer(ProfileSidebar);
