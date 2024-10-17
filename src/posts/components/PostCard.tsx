import { Post } from "@furxus/types";
import moment from "moment";
import classNames from "classnames";
import VideoPlayer from "@/shared/components/video/VideoPlayer";
import PostImage from "./PostImage";
import { FaHeart } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import { LikePost, UnlikePost } from "@gql/posts";
import CommentPopover from "./comments/CommentPopover";
import Stack from "@mui/material/Stack";
import UserAvatar from "@/shared/components/avatar/UserAvatar";

const PostCard = ({ post }: { post: Post }) => {
    const { user } = post;

    const [likePost] = useMutation(LikePost, {
        variables: {
            postId: post.id,
        },
    });

    const [unlikePost] = useMutation(UnlikePost, {
        variables: {
            postId: post.id,
        },
    });

    if (post.content?.video)
        return (
            <Stack
                className={classNames("w-1/3 rounded-lg")}
                alignItems="center"
                gap={2}
            >
                <Stack className="w-full h-full">
                    {(post.content?.video || post.content?.image) && (
                        <VideoPlayer post={post} />
                    )}
                </Stack>
            </Stack>
        );

    return (
        <Stack
            className={classNames("w-1/3 p-4 rounded-lg", {
                "border border-blue-500":
                    post.content?.text || post.content?.image,
            })}
            alignItems="flex-start"
            gap={2}
        >
            <Stack
                direction="row"
                className="w-full"
                justifyContent="space-between"
            >
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    gap={0.5}
                >
                    <UserAvatar user={user} />
                    <p className="font-bold">{user?.displayName}</p>
                </Stack>
                <Stack justifyContent="center" alignItems="center">
                    <time
                        className="text-gray-500 text-xs"
                        dateTime={post.createdAt}
                    >
                        {moment(post.createdAt).calendar()} (
                        {moment(post.createdAt).fromNow()})
                    </time>
                </Stack>
            </Stack>
            {post.content?.text && <p>{post.content?.text}</p>}
            {post.content?.image && <PostImage post={post} />}
            <Stack
                direction="row"
                alignItems="center"
                gap={1}
                className="w-full"
            >
                <Stack direction="row" alignItems="center" gap={0.5}>
                    {post.likes?.some((usr) => usr.id === user?.id) ? (
                        <FaHeart
                            size={18}
                            color="red"
                            className="cursor-pointer"
                            onClick={() => unlikePost()}
                        />
                    ) : (
                        <FaHeart
                            size={18}
                            className="cursor-pointer"
                            onClick={() => likePost()}
                        />
                    )}
                    <p>{post.likes?.length}</p>
                </Stack>
                <Stack direction="row" alignItems="center" gap={0.5}>
                    <CommentPopover size={18} post={post} type="nonVideo" />
                    <p>{post.comments?.length}</p>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default PostCard;
