import SidebarPosts from "../../posts/components/SidebarPosts";
import SidebarServers from "../../servers/components/SidebarServers";
import { useAppMode } from "../../hooks";
import SwitchModeButton from "./SwitchModeButton";
import classNames from "classnames";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

const Sidebar = () => {
    const { appMode } = useAppMode();

    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            gap="0.25rem"
            className={classNames("h-screen bg-neutral-700/[.2]", {
                "border-r border-blue-500/60": appMode === "posts",
                "border-r border-green-500/60": appMode === "servers",
            })}
        >
            <Avatar
                className={classNames({
                    "border-2 border-blue-500/60": appMode === "posts",
                    "border-2 border-green-500/60": appMode === "servers",
                })}
                src={appMode === "servers" ? "/logo2.png" : "/logo.png"}
                sx={{ width: 64, height: 64 }}
            />

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

            <div className="p-1">
                <SwitchModeButton />
            </div>
        </Stack>
    );
};

export default Sidebar;
