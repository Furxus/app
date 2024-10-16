import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";

const DMsLayout = () => {
    return (
        <Stack
            alignItems="flex-start"
            justifyContent="flex-start"
            direction="row"
            className="w-full h-full"
        >
            <Outlet />
        </Stack>
    );
};

export default DMsLayout;
