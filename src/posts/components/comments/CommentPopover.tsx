import { Comment, Post } from "@furxus/types";

import classNames from "classnames";
import { ComponentPropsWithoutRef, forwardRef, useState } from "react";
import { FaCommentDots } from "react-icons/fa";

import CommentTextInput from "./CommentTextInput";
import CommentComponent from "./Comment.component";
import Stack from "@mui/material/Stack";
import Popover from "@mui/material/Popover";
import ScrollContainer from "@/shared/components/ScrollContainer";

export const CommentButton = forwardRef<
    HTMLDivElement,
    ComponentPropsWithoutRef<"div"> & {
        type: "nonVideo" | "video";
        size: number;
    }
>((props, ref) => (
    <div ref={ref} {...props}>
        <FaCommentDots
            size={props.size}
            className={classNames("cursor-pointer", {
                "text-2xl": props.type === "video",
            })}
        />
    </div>
));

CommentButton.displayName = "CommentButton";

const CommentPopover = ({
    post,
    type,
    size,
}: {
    post: Post;
    type: "nonVideo" | "video";

    size: number;
}) => {
    const [comments] = useState<Comment[]>([]);
    const called = false;
    /*const [
        loadComments,
        { called, subscribeToMore, data: { getComments: comments = [] } = {} },
    ] = useLazyQuery(GetComments, {
        variables: {
            postId: post.id,
        },
    });*/

    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    /*useEffect(() => {
        const unsubcribe = subscribeToMore({
            document: OnCommentCreated,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const newComment = subscriptionData.data.commentCreated;
                if (!newComment) return;

                return {
                    getComments: [newComment, ...prev.getComments],
                };
            },
            variables: {
                postId: post.id,
            },
        });

        return () => unsubcribe();
    }, []);*/

    const togglePopover = (e: any) => {
        // if (!called) loadComments();
        if (anchorEl) setAnchorEl(null);
        else setAnchorEl(e.currentTarget);
        setOpen(!open);
    };

    return (
        <>
            <CommentButton onClick={togglePopover} type={type} size={size} />
            <Popover
                open={open}
                anchorOrigin={{ vertical: "center", horizontal: "right" }}
                anchorEl={anchorEl}
                onClose={togglePopover}
            >
                <Stack
                    direction="column"
                    width={{
                        sm: "100%",
                        md: "500px",
                    }}
                >
                    {called ? (
                        comments.length > 0 ? (
                            <ScrollContainer className="p-4 flex gap-4 flex-col">
                                {comments.map((comment: Comment) => (
                                    <CommentComponent
                                        key={comment.id}
                                        comment={comment}
                                    />
                                ))}
                            </ScrollContainer>
                        ) : (
                            <p className="text-center p-4">No comments yet</p>
                        )
                    ) : (
                        <p className="text-center">Loading...</p>
                    )}
                    <CommentTextInput post={post} />
                </Stack>
            </Popover>
        </>
    );
};
export default CommentPopover;
