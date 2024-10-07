import { Post } from "@furxus/types";

const PostImage = ({ post }: { post: Post }) => {
    return (
        <img
            className="w-full"
            src={post.content?.image}
            alt={post.content?.text}
        />
    );
};

export default PostImage;
