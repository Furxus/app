import SidebarPosts from "@/posts/components/SidebarPosts";
import SidebarServers from "@servers/components/SidebarServers";
import { useAppMode, useAuth } from "@hooks";
import classNames from "classnames";
import Avatar from "@/shared/components/avatar/Avatar";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";
import SidebarFriends from "@/friends/components/SidebarFriends.component";

const Sidebar = () => {
    const { user } = useAuth();
    const { appMode, changeAppMode } = useAppMode();

    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            gap="0.25rem"
            pt={1}
            className={classNames("h-dvh bg-neutral-700/[.4]", {
                "border-r border-blue-500/60": appMode === "posts",
                "border-r border-green-500/60": appMode === "servers",
                "gradient-sidebar": appMode === "friends",
            })}
        >
            <Avatar
                className={classNames("cursor-pointer", {
                    "gradient-logo-servers": appMode === "posts",
                    "gradient-logo-posts": appMode === "servers",
                    "gradient-logo-both": appMode === "friends",
                })}
                src={
                    appMode === "friends"
                        ? "/icon.png"
                        : appMode === "servers"
                        ? "/logo2.png"
                        : "/logo.png"
                }
                sx={{ width: 64, height: 64 }}
                onClick={() =>
                    changeAppMode(
                        appMode === "friends"
                            ? user.preferences?.mode ?? "servers"
                            : appMode === "servers"
                            ? "posts"
                            : "servers"
                    )
                }
            />
            <Stack
                alignItems="center"
                className={classNames(
                    "flex-grow w-full shadow-2xl bg-neutral-700/[.4] px-5 py-3 gap-1",
                    {
                        "border-blue-500/60": appMode === "posts",
                        "border-green-500/60": appMode === "servers",
                        "gradient-sidebar": appMode === "friends",
                    }
                )}
            >
                {appMode === "posts" && <SidebarPosts />}
                {appMode === "servers" && <SidebarServers />}
                {appMode === "friends" && <SidebarFriends />}
            </Stack>
            <Stack pb={0.9} gap={1} alignItems="center">
                <Avatar
                    sx={{
                        width: 64,
                        height: 64,
                    }}
                    className="gradient-button cursor-pointer"
                    onClick={() =>
                        appMode === "friends"
                            ? changeAppMode(user.preferences?.mode ?? "servers")
                            : changeAppMode("friends")
                    }
                >
                    <Typography variant="caption">Friends</Typography>
                </Avatar>
            </Stack>
        </Stack>
    );
};

export default Sidebar;
