import SidebarPosts from "@/posts/components/SidebarPosts.component";
import SidebarServers from "@/servers/components/SidebarServers.component";
import { useAuth } from "@hooks";
import classNames from "classnames";
import Avatar from "@/shared/components/avatar/Avatar.component";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/hooks/useAppStore";
import { observer } from "mobx-react-lite";

const Sidebar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const app = useAppStore();

    let icon = "/icon.png";
    switch (app.appMode.mode) {
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
            flexGrow={1}
            pt={1}
            className={classNames("py-2 px-3 bg-neutral-700/[.4] border-r", {
                "border-blue-500/60": app.appMode.mode === "posts",
                "border-green-500/60": app.appMode.mode === "servers",
                "border-[#367588]/60": app.appMode.mode === "dms",
            })}
        >
            <Button
                sx={{ width: 64, height: 64 }}
                className="rounded-full"
                variant="text"
                onClick={() =>
                    app.appMode.switch(
                        app.appMode.mode === "dms"
                            ? user?.preferences?.mode ?? "servers"
                            : app.appMode.mode === "servers"
                            ? "posts"
                            : "servers",
                        navigate
                    )
                }
            >
                <Avatar
                    className={classNames({
                        "gradient-logo-servers": app.appMode.mode === "posts",
                        "gradient-logo-posts": app.appMode.mode === "servers",
                        "gradient-logo-both": app.appMode.mode === "dms",
                    })}
                    src={icon}
                    sx={{ width: 64, height: 64 }}
                />
            </Button>
            <Stack className="h-full w-full" alignItems="center">
                {app.appMode.mode === "posts" && <SidebarPosts />}
                {app.appMode.mode === "servers" && <SidebarServers />}
                {app.appMode.mode === "dms" && <SidebarServers />}
            </Stack>
            <Button
                sx={{ width: 64, height: 64 }}
                className="rounded-full"
                variant="text"
                onClick={() =>
                    app.appMode.current === "dms"
                        ? app.appMode.switch(
                              user?.preferences?.mode ?? "servers",
                              navigate
                          )
                        : app.appMode.switch("dms", navigate)
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

export default observer(Sidebar);
