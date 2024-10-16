import SidebarIcon from "@/shared/components/sidebar/SidebarIcon";
import { Stack } from "@mui/material";

const SidebarPosts = () => {
    const mockData: any[] = [
        {
            id: "1",
            username: "mateie",
            globalName: "Stealth",
            avatar: "https://static-00.iconduck.com/assets.00/perspective-dice-random-icon-469x512-mm6xb9so.png",
            avatarUrl:
                "https://static-00.iconduck.com/assets.00/perspective-dice-random-icon-469x512-mm6xb9so.png",
        },
        {
            id: "2",
            username: "jeff",
            globalName: "Jeff Bezos",
            avatar: "https://static-00.iconduck.com/assets.00/perspective-dice-random-icon-469x512-mm6xb9so.png",
            avatarUrl:
                "https://static-00.iconduck.com/assets.00/perspective-dice-random-icon-469x512-mm6xb9so.png",
        },
        {
            id: "3",
            username: "lolee",
        },
        {
            id: "4",
            username: "hehehaha",
            globalName: "Hehe Haha",
        },
    ];

    return (
        <Stack
            direction="column"
            flexGrow={1}
            className="shadow-2xl bg-neutral-700[.4]"
        >
            {mockData.map((user) => (
                <SidebarIcon key={user.id} user={user} />
            ))}
        </Stack>
    );
};

export default SidebarPosts;
