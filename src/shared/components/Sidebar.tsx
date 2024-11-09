import SidebarPosts from "@/posts/components/SidebarPosts";
import SidebarServers from "@servers/components/SidebarServers";
import { useAppMode, useAuth } from "@hooks";
import classNames from "classnames";
import Avatar from "@/shared/components/avatar/Avatar";
import Stack from "@mui/material/Stack";
import { Button, Typography } from "@mui/material";

const Sidebar = () => {
    const { user } = useAuth();
    const { appMode, changeAppMode } = useAppMode();

    let icon = "/icon.png";
    switch (appMode) {
        case "posts":
            icon = "/logo.png";
            break;
        case "servers":
            icon = "/logo2.png";
            break;
        case "dms":
            icon = "/icon.png";
    }

    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            gap={2}
            pt={1}
            className={classNames("py-2 px-3 h-dvh bg-neutral-700/[.4]", {
                "border-r border-blue-500/60": appMode === "posts",
                "border-r border-green-500/60":
                    appMode === "servers" || appMode === "dms",
            })}
        >
            <Button
                sx={{ width: 64, height: 64 }}
                className="rounded-full"
                variant="text"
                onClick={() =>
                    changeAppMode(
                        appMode === "dms"
                            ? user?.preferences?.mode ?? "servers"
                            : appMode === "servers"
                            ? "posts"
                            : "servers"
                    )
                }
            >
                <Avatar
                    className={classNames({
                        "gradient-logo-servers": appMode === "posts",
                        "gradient-logo-posts": appMode === "servers",
                        "gradient-logo-both": appMode === "dms",
                    })}
                    src={icon}
                    sx={{ width: 64, height: 64 }}
                />
            </Button>
            <Stack className="h-full w-full" alignItems="center">
                {appMode === "posts" && <SidebarPosts />}
                {appMode === "servers" && <SidebarServers />}
                {appMode === "dms" && <SidebarServers />}
            </Stack>
            <Button
                sx={{ width: 64, height: 64 }}
                className="rounded-full"
                variant="text"
                onClick={() =>
                    appMode === "dms"
                        ? changeAppMode(user?.preferences?.mode ?? "servers")
                        : changeAppMode("dms")
                }
            >
                <Avatar
                    sx={{
                        width: 64,
                        height: 64,
                    }}
                    className="gradient-logo-both"
                >
                    <Typography variant="button">DMs</Typography>
                </Avatar>
            </Button>
        </Stack>
    );
};

export default Sidebar;
