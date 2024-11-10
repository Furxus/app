import { Post } from "@furxus/types";

import { FaHeart } from "react-icons/fa";
import { useAuth } from "@hooks";
import CommentPopover from "@/posts/components/comments/CommentPopover.component";
import Stack from "@mui/material/Stack";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";

const VideoSidebar = ({ post }: { post: Post }) => {
    const { user } = useAuth();

    const { mutate: likePost } = useMutation({
        mutationKey: ["likePost"],
        mutationFn: () => api.post(`/posts/${post.id}/like`),
    });

    const { mutate: unlikePost } = useMutation({
        mutationKey: ["unlikePost"],
        mutationFn: () => api.delete(`/posts/${post.id}/like`),
    });

    return (
        <div className="absolute top-1/2 right-[10px] text-white">
            <Stack className="flex-col gap-4">
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    {post.likes?.some((usr) => usr.id === user?.id) ? (
                        <FaHeart
                            size={24}
                            onClick={() => unlikePost()}
                            color="red"
                            className="text-2xl cursor-pointer"
                        />
                    ) : (
                        <FaHeart
                            size={24}
                            onClick={() => likePost()}
                            className="text-2xl cursor-pointer"
                        />
                    )}
                    <p>{post.likes?.length}</p>
                </Stack>
                <Stack justifyContent="center" alignItems="center">
                    <CommentPopover size={24} post={post} type="video" />
                    <p>{post.comments?.length}</p>
                </Stack>
            </Stack>
        </div>
    );
};

export default VideoSidebar;
