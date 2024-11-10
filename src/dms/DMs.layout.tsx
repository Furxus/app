import Stack from "@mui/material/Stack";
import { Outlet } from "react-router-dom";
import SidebarDMs from "./components/SidebarDMs.component";

const DMsLayout = () => {
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
