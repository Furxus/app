import PostsNavbar from "./components/PostsNavbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Stack from "@mui/material/Stack";

const PostLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/posts" || location.pathname === "/posts/")
            navigate("/posts/trending");

        return () => {};
    }, [location.pathname]);

    return (
        <Stack className="w-full h-full">
            <PostsNavbar />
            <Stack className="p-8 overflow-y-auto">
                <Outlet />
            </Stack>
        </Stack>
    );
};

export default PostLayout;
