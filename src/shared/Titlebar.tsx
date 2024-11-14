import { useTauri } from "@/hooks";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";

import { useEffect, useState } from "react";
import { MdClose, MdMinimize } from "react-icons/md";
import { FiMaximize, FiMinimize } from "react-icons/fi";

const Titlebar = () => {
    const { window } = useTauri();

    const [windowMaximized, setWindowMaximized] = useState(false);

    useEffect(() => {
        window?.onResized(async () => {
            console.log(windowMaximized);
            setWindowMaximized(await window?.isMaximized());
        });
    }, []);

    const handleMaximize = () => {
        windowMaximized ? window?.unmaximize() : window?.maximize();
        setWindowMaximized(!windowMaximized);
    };

    return (
        <Stack
            data-tauri-drag-region
            className="w-full shadow-xl"
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            pr={0.5}
            pl={2.5}
            pt={0.5}
        >
            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                className="text-neutral-400"
            >
                <Typography variant="body2">Furxus</Typography>
            </Stack>
            <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                gap={1}
            >
                <MdMinimize
                    className="hover:cursor-pointer"
                    onClick={() => window?.minimize()}
                />
                {windowMaximized ? (
                    <FiMinimize
                        className="hover:cursor-pointer"
                        onClick={() => handleMaximize()}
                    />
                ) : (
                    <FiMaximize
                        className="hover:cursor-pointer"
                        onClick={() => handleMaximize()}
                    />
                )}

                <MdClose
                    className="hover:cursor-pointer"
                    onClick={() => window?.close()}
                />
            </Stack>
        </Stack>
    );
};

export default Titlebar;
