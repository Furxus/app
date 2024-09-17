import Tooltip from "@mui/material/Tooltip";
import { useAppMode } from "@hooks";
import classNames from "classnames";
import Avatar from "@mui/material/Avatar";

const SwitchModeButton = () => {
    const { appMode, changeAppMode } = useAppMode();

    return (
        <>
            <Tooltip
                placement="right"
                color="gray"
                title={`Switch to ${
                    appMode === "servers" ? "Posts" : "Servers"
                }`}
            >
                <Avatar
                    className={classNames(
                        "cursor-pointer",
                        appMode === "servers"
                            ? "border-2 border-green-500/60"
                            : "border-2 border-blue-500/60"
                    )}
                    onClick={() =>
                        changeAppMode(
                            appMode === "servers" ? "posts" : "servers"
                        )
                    }
                    sx={{ width: 64, height: 64 }}
                >
                    <span className="text-sm">
                        {appMode === "servers" ? "Servers" : "Posts"}
                    </span>
                </Avatar>
            </Tooltip>
        </>
    );
};

export default SwitchModeButton;
