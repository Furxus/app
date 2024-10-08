import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import SidebarFriends from "./components/SidebarFriends.component";

const FriendsLayout = () => {
    return (
        <Stack direction="row" className="w-full h-full">
            <SidebarFriends />
            <Outlet />
        </Stack>
    );
};

export default FriendsLayout;
