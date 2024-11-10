import { api } from "@/api";
import UserAvatar from "@/shared/components/avatar/UserAvatar.component";
import { User } from "@furxus/types";
import { Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const SidebarPosts = () => {
    const navigate = useNavigate();

    const { data: friends } = useQuery<User[]>({
        queryKey: ["meFriends"],
        queryFn: () => api.get("/@me/friends").then((res) => res.data),
    });

    return (
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap={1}
        >
            {friends?.map((friend, i: number) => (
                <UserAvatar
                    user={friend}
                    key={i}
                    button={{
                        btnProps: {
                            onClick: () => {
                                navigate(`/posts/${friend.id}`);
                            },
                        },
                    }}
                    tooltip={{
                        tooltipProps: {
                            title: (
                                <Typography
                                    variant="body2"
                                    className="text-white"
                                >
                                    {friend.displayName ?? friend.username}
                                </Typography>
                            ),
                            arrow: true,
                            placement: "right",
                            children: <></>,
                        },
                    }}
                    withTooltip
                />
            ))}
        </Stack>
    );
};

export default SidebarPosts;
