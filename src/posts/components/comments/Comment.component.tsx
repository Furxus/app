import { Comment } from "@furxus/types";
import Stack from "@mui/material/Stack";
import moment from "moment";
import UserAvatar from "@/shared/components/avatar/UserAvatar";

const CommentComponent = ({ comment }: { comment: Comment }) => {
    return (
        <Stack p={2} className="border border-blue-500/60 rounded-xl" gap={2}>
            <Stack
                direction="row"
                alignItems="center"
                gap={8}
                justifyContent="space-between"
            >
                <Stack direction="row" alignItems="center" gap={4}>
                    <UserAvatar user={comment.user} />
                    <span className="font-semibold">
                        {comment.user?.displayName ?? comment.user?.username}
                    </span>
                </Stack>
                <time
                    dateTime={comment.createdAt}
                    className="text-xs text-gray-400"
                >
                    {moment(comment.createdAt).calendar()} (
                    {moment(comment.createdAt).fromNow()})
                </time>
            </Stack>
            <p>{comment.content}</p>
        </Stack>
    );
};

export default CommentComponent;
