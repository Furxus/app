import { useEffect, useRef, useState } from "react";
import {
    GetPaginatedPosts,
    GetPosts,
    OnPostCreated,
    OnPostDeleted,
    OnPostLiked,
    OnPostUnliked,
} from "@gql/posts";
import { useQuery } from "@apollo/client";
import InfiniteScroll from "react-infinite-scroller";
import { Post } from "@furxus/types";
import PostCard from "../components/PostCard";

import Stack from "@mui/material/Stack";

const PostsTrending = () => {
    const { data: { getPosts: allPosts } = {} } = useQuery(GetPosts);
    const [hasMore, setHasMore] = useState(true);
    const parentRef = useRef<HTMLDivElement>(null);

    const {
        subscribeToMore,
        fetchMore,
        data: { getPaginatedPosts: posts = [] } = [],
    } = useQuery(GetPaginatedPosts, {
        variables: {
            offset: 0,
        },
        fetchPolicy: "cache-and-network",
    });

    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: OnPostCreated,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const newPost = subscriptionData.data.postCreated;
                if (!newPost) return;

                return {
                    getPaginatedPosts: [...prev.getPaginatedPosts, newPost],
                };
            },
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: OnPostDeleted,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const deletedPost = subscriptionData.data.postDeleted;
                if (!deletedPost) return;

                return {
                    getPaginatedPosts: prev.getPaginatedPosts.filter(
                        (post: any) => post.id !== deletedPost.id
                    ),
                };
            },
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: OnPostLiked,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const likedPost = subscriptionData.data.postLiked;
                if (!likedPost) return;

                return {
                    getPaginatedPosts: prev.getPaginatedPosts.map(
                        (post: any) => {
                            if (post.id === likedPost.id) {
                                return likedPost;
                            }
                            return post;
                        }
                    ),
                };
            },
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: OnPostUnliked,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const unlikedPost = subscriptionData.data.postUnliked;
                if (!unlikedPost) return;

                return {
                    getPaginatedPosts: prev.getPaginatedPosts.map(
                        (post: any) => {
                            if (post.id === unlikedPost.id) {
                                return unlikedPost;
                            }
                            return post;
                        }
                    ),
                };
            },
        });

        return () => unsubscribe();
    }, []);

    const fetchMoreData = () => {
        fetchMore({
            variables: { offset: posts.length },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                if (!fetchMoreResult.getPaginatedPosts) return prev;
                if (fetchMoreResult.getPaginatedPosts.length === 0) return prev;

                if (fetchMoreResult.getPaginatedPosts.length < 10)
                    setHasMore(false);

                return {
                    ...prev,
                    getPaginatedPosts: [
                        ...prev.getPaginatedPosts,
                        ...fetchMoreResult.getPaginatedPosts,
                    ],
                };
            },
        });
    };

    if (!posts) return <></>;
    if (!allPosts) return <></>;
    if (posts.length < 1) return <></>;
    return (
        <Stack ref={parentRef} className="m-auto">
            <InfiniteScroll
                loadMore={fetchMoreData}
                hasMore={hasMore}
                className="flex flex-col gap-8 justify-center items-center"
                useWindow={false}
                getScrollParent={() => parentRef.current}
            >
                {posts.map((post: Post) => (
                    <PostCard post={post} key={post.id} />
                ))}
            </InfiniteScroll>
        </Stack>
    );
};

export default PostsTrending;
