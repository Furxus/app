import { Post } from "@furxus/types";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

import moment from "moment";

const VideoFooter = ({ post }: { post: Post }) => {
    const { user } = post;

    return post.content.text ? (
        <Stack className="relative text-white ml-3 mr-2 flex justify-start align-center flex-col bottom-[4.5rem] gap-1">
            <Stack
                direction="row"
                gap={0.5}
                alignItems="center"
                className="flex"
            >
                <Avatar src={user.avatar ?? user.defaultAvatar}>
                    {user.nameAcronym}
                </Avatar>
                <p className="font-bold">{user.displayName ?? user.username}</p>
            </Stack>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                className="w-full"
            >
                <p className="text-sm">{post.content.text}</p>
                <time className="text-xs" dateTime={post.createdAt}>
                    {moment(post.createdAt).fromNow()}
                </time>
            </Stack>
        </Stack>
    ) : (
        <Stack className="relative text-white ml-3 mr-2 flex justify-start align-center flex-col bottom-[4rem] gap-1">
            <Stack direction="row" alignItems="center" className="gap-1">
                <Avatar src={user.avatar ?? user.defaultAvatar}>
                    {user.nameAcronym}
                </Avatar>
                <p className="font-bold">{user.displayName ?? user.username}</p>
            </Stack>
            <time className="text-xs" dateTime={post.createdAt}>
                {moment(post.createdAt).fromNow()}
            </time>
        </Stack>
    );
};

export default VideoFooter;
