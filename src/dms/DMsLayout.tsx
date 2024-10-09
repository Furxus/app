import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import SidebarDMs from "./components/SidebarDMs.component";

const DMsLayout = () => {
    return (
        <Stack direction="row" className="w-full h-full">
            <SidebarDMs />
            <Outlet />
        </Stack>
    );
};

export default DMsLayout;
