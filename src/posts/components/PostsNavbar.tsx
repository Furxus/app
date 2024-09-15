import { useNavigate } from "react-router-dom";
import CreatePostButton from "./CreatePostButton";
import { FaFire, FaUsers } from "react-icons/fa";
import IconButton from "@mui/material/IconButton";

const PostsNavbar = () => {
    const navigate = useNavigate();

    return (
        <div className="flex h-[4.34rem] justify-between items-center w-full border-b border-blue-500/60 shadow-2xl px-4 py-4 bg-neutral-700[.2]">
            <div className="flex justify-start items-center gap-2">
                <CreatePostButton />
            </div>
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
        </div>
    );
};

export default PostsNavbar;
