import Avatar from "@mui/material/Avatar";

const APIDown = () => {
    return (
        <div className="flex flex-col gap-2 justify-center items-center h-screen">
            <Avatar src="/logo.png" sx={{ width: 64, height: 64 }} />
            <span className="text-3xl font-bold">Furxus</span>
            <span className="text-xl font-bold">The app is down😿</span>
        </div>
    );
};

export default APIDown;
