import { useMutation } from "@apollo/client";
import { Post } from "@furxus/types";
import { useState } from "react";
import { CreateComment } from "@gql/comments";
import { FaArrowRight } from "react-icons/fa";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";

const CommentTextInput = ({ post }: { post: Post }) => {
    const [comment, setComment] = useState("");

    const [createComment, { loading }] = useMutation(CreateComment, {
        variables: {
            postId: post.id,
            content: comment,
        },
    });

    const sendComment = () => {
        createComment();
        setComment("");
    };

    return (
        <Stack
            direction="row"
            p={2}
            justifyContent="center"
            alignItems="center"
            className="w-full sticky bottom-0 bg-neutral-800 z-50"
        >
            <TextField
                className="w-full"
                placeholder="Write a comment..."
                sx={{
                    "& .MuiInputBase-root": {
                        borderRadius: 4,
                        backgroundColor: "rgb(0 0 0 / 8%)",
                    },
                }}
                color="primary"
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                onKeyDown={(e) => {
                    if (e.key === "Enter") sendComment();
                }}
            />
            <IconButton
                color="primary"
                style={{ marginLeft: 8 }}
                disabled={comment.length === 0 || loading}
                onClick={() => sendComment()}
            >
                <FaArrowRight />
            </IconButton>
        </Stack>
    );
};

export default CommentTextInput;
