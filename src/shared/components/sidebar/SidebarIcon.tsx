import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";

const SidebarIcon = ({ user }: any) => {
    const navigate = useNavigate();

    const UserIcon = () => (
        <Tooltip
            color="gray"
            placement="right"
            title={user.globalName ?? user.username}
        >
            {user.avatar ? (
                <Avatar
                    src={user.avatar}
                    onClick={() => navigate(`/posts/${user.id}`)}
                    className="cursor-pointer"
                    sx={{ width: 56, height: 56, bgcolor: "transparent" }}
                />
            ) : (
                <Avatar
                    onClick={() => navigate(`/posts/${user.id}`)}
                    className="cursor-pointer"
                    sx={{ width: 56, height: 56 }}
                >
                    {(user.globalName ?? user.username)
                        .split(" ")
                        .map((word: string) => word[0])
                        .join("")
                        .toUpperCase()}
                </Avatar>
            )}
        </Tooltip>
    );

    return <UserIcon />;
};

export default SidebarIcon;
