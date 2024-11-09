import { socket } from "@/api";
import { Stack } from "@mui/material";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import SidebarDMs from "./components/SidebarDMs.component";

const DMsLayout = () => {
    const { dmId } = useParams();

    useEffect(() => {
        socket.emit("dm:focus", dmId);

        return () => {
            socket.emit("dm:blur", dmId);
        };
    }, []);

    return (
        <Stack
            alignItems="flex-start"
            justifyContent="flex-start"
            direction="row"
            className="w-full h-full"
        >
            <SidebarDMs />
            <Outlet />
        </Stack>
    );
};

export default DMsLayout;
