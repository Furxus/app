import Avatar from "@mui/material/Avatar";

const APILoading = () => {
    return (
        <div className="flex flex-col justify-center items-center gap-2 h-screen">
            <Avatar src="/logo-animated.gif" sx={{ width: 128, height: 128 }} />
        </div>
    );
};

export default APILoading;
