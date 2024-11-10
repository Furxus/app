import { useNavigate } from "react-router-dom";
import CreatePostButton from "./CreatePostButton.component";
import { FaFire, FaUsers } from "react-icons/fa";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

const PostsNavbar = () => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-center w-full border-b border-blue-500/60 shadow-2xl px-4 py-4 bg-neutral-700[.2]">
            <div className="flex gap-2 items-center">
                <IconButton
                    onClick={() => navigate("/posts/trending")}
                    color="error"
                >
                    <FaFire />
                </IconButton>
                <IconButton
                    color="primary"
                    onClick={() => navigate("/posts/following")}
                >
                    <FaUsers />
                </IconButton>
            </div>
            <Stack
                justifyContent="flex-start"
                alignItems="center"
                className="justify-start items-center gap-2"
            >
                <CreatePostButton />
            </Stack>
        </div>
    );
};

export default PostsNavbar;
