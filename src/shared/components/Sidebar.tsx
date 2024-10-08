import SidebarPosts from "@/posts/components/SidebarPosts";
import SidebarServers from "@servers/components/SidebarServers";
import { useAppMode } from "@hooks";
import classNames from "classnames";
import Avatar from "@/shared/components/avatar/Avatar";
import Stack from "@mui/material/Stack";
import { Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const Sidebar = () => {
    const { appMode, changeAppMode } = useAppMode();
    const [bounce, setBounce] = useState(true);

    useEffect(() => {
        if (bounce) setTimeout(() => setBounce(false), 4500);
    }, []);

    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            gap="0.25rem"
            pt={1}
            className={classNames("h-dvh bg-neutral-700/[.2]", {
                "border-r border-blue-500/60": appMode === "posts",
                "border-r border-green-500/60": appMode === "servers",
            })}
        >
            <Tooltip
                placement="right"
                color="gray"
                title={
                    <Typography>
                        Switch to {appMode === "servers" ? "Posts" : "Servers"}
                    </Typography>
                }
            >
                <Avatar
                    className={classNames("cursor-pointer", {
                        "animate-bounce": bounce,
                    })}
                    src={appMode === "servers" ? "/logo2.png" : "/logo.png"}
                    sx={{ width: 64, height: 64 }}
                    onClick={() =>
                        changeAppMode(
                            appMode === "servers" ? "posts" : "servers"
                        )
                    }
                />
            </Tooltip>
            <Stack
                alignItems="center"
                className={classNames(
                    "flex-grow w-full shadow-2xl bg-neutral-700/[.4] px-5 py-3 border-y gap-1",
                    {
                        "border-blue-500/60": appMode === "posts",
                        "border-green-500/60": appMode === "servers",
                    }
                )}
            >
                {appMode === "posts" ? <SidebarPosts /> : <SidebarServers />}
            </Stack>
        </Stack>
    );
};

export default Sidebar;
