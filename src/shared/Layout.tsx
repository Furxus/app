import Stack from "@mui/material/Stack";
import Sidebar from "./web/components/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <Stack
            onContextMenu={(e) =>
                !import.meta.env.DEV ? e.preventDefault() : undefined
            }
            direction="row"
        >
            <Sidebar />
            <Stack className="w-full h-screen">
                <Outlet />
            </Stack>
        </Stack>
    );
};

export default Layout;
