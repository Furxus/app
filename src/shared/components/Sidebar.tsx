import SidebarPosts from "@/posts/components/SidebarPosts";
import SidebarServers from "@servers/components/SidebarServers";
import { useAppMode, useAuth } from "@hooks";
import classNames from "classnames";
import Avatar from "@/shared/components/avatar/Avatar";
import Stack from "@mui/material/Stack";
import { Button, Typography } from "@mui/material";
import SidebarDMs from "@/dms/components/SidebarDMs.component";

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
                "gradient-sidebar": appMode === "dms",
            })}
        >
            <Button
                sx={{ width: 64, height: 64 }}
                className="rounded-full"
                variant="text"
                onClick={() =>
                    changeAppMode(
                        appMode === "dms"
                            ? user.preferences?.mode ?? "servers"
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
                    src={
                        appMode === "dms"
                            ? "/icon.png"
                            : appMode === "servers"
                            ? "/logo2.png"
                            : "/logo.png"
                    }
                    sx={{ width: 64, height: 64 }}
                />
            </Button>
            <Stack
                alignItems="center"
                className={classNames(
                    "flex-grow w-full shadow-2xl bg-neutral-700/[.4] px-5 py-3 gap-1",
                    {
                        "border-blue-500/60": appMode === "posts",
                        "border-green-500/60": appMode === "servers",
                        "gradient-sidebar": appMode === "dms",
                    }
                )}
            >
                {appMode === "posts" && <SidebarPosts />}
                {appMode === "servers" && <SidebarServers />}
                {appMode === "dms" && <SidebarDMs />}
            </Stack>
            <Stack pb={0.9} gap={1} alignItems="center">
                <Button>
                    <Avatar
                        sx={{
                            width: 64,
                            height: 64,
                        }}
                        className="gradient-button cursor-pointer"
                        onClick={() =>
                            appMode === "dms"
                                ? changeAppMode(
                                      user.preferences?.mode ?? "servers"
                                  )
                                : changeAppMode("dms")
                        }
                    >
                        <Typography variant="button">DMs</Typography>
                    </Avatar>
                </Button>
            </Stack>
        </Stack>
    );
};

export default Sidebar;
