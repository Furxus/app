import { gql } from "@apollo/client";

export const GetPosts = gql`
    query getPosts {
        getPosts {
            id
            content {
                text
                image
                video
                audio
            }
            createdTimestamp
            createdAt
            user {
                id
                username
                displayName
                nameAcronym
                avatar
                defaultAvatar
            }
        }
    }
`;

export const GetPaginatedPosts = gql`
    query getPaginatedPosts($offset: Int!) {
        getPaginatedPosts(offset: $offset) {
            id
            content {
                text
                image
                video
                audio
            }
            createdTimestamp
            createdAt
            likes {
                id
                username
                displayName
                nameAcronym
                avatar
                defaultAvatar
            }
            comments {
                id
                content
                createdAt
                createdTimestamp
                user {
                    id
                    username
                    displayName
                    nameAcronym
                    avatar
                    defaultAvatar
                }
            }
            user {
                id
                username
                displayName
                nameAcronym
                avatar
                defaultAvatar
            }
        }
    }
`;

export const CreatePost = gql`
    mutation createPost($text: String, $media: Upload) {
        createPost(content: { text: $text, media: $media }) {
            id
            content {
                text
                image
                video
                audio
            }
            createdTimestamp
            user {
                id
                username
                displayName
                nameAcronym
                avatar
                defaultAvatar
            }
        }
    }
`;

export const OnPostCreated = gql`
    subscription postCreated {
        postCreated {
            id
            content {
                text
                image
                video
                audio
            }
            createdTimestamp
            createdAt
            user {
                id
                username
                displayName
                nameAcronym
                avatar
                defaultAvatar
            }
        }
    }
`;

export const OnPostDeleted = gql`
    subscription postDeleted {
        postDeleted {
            id
        }
    }
`;

export const LikePost = gql`
    mutation likePost($postId: String!) {
        likePost(postId: $postId) {
            id
            likes {
                id
                username
                displayName
                nameAcronym
                avatar
                defaultAvatar
            }
        }
    }
`;

export const GetLikeCount = gql`
    query getLikeCount($postId: String!) {
        getLikeCount(postId: $postId)
    }
`;

export const UnlikePost = gql`
    mutation unlikePost($postId: String!) {
        unlikePost(postId: $postId) {
            id
            likes {
                id
                username
                displayName
                nameAcronym
                avatar
                defaultAvatar
            }
        }
    }
`;

export const OnPostLiked = gql`
    subscription postLiked {
        postLiked {
            id
            likes {
                id
                username
                displayName
                nameAcronym
                avatar
                defaultAvatar
            }
        }
    }
`;

export const OnPostUnliked = gql`
    subscription postUnliked {
        postUnliked {
            id
            likes {
                id
                username
                displayName
                nameAcronym
                avatar
                defaultAvatar
            }
        }
    }
`;
