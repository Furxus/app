import { Alert, Snackbar, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import SidebarDMs from "./components/SidebarDMs.component";

const DMsLayout = () => {
    return (
        <>
            <Stack direction="row" className="w-full h-full">
                <SidebarDMs />
                <Outlet />
            </Stack>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={true}
            >
                <Alert severity="warning" className="text-center">
                    The DMs are currently being worked on, so some features may
                    be missing :3 <br />
                    <br /> Thank you for your patience
                </Alert>
            </Snackbar>
        </>
    );
};

export default DMsLayout;
