import { gql } from "@apollo/client";

export const CreateComment = gql`
    mutation createComment($postId: String!, $content: String!) {
        createComment(postId: $postId, content: $content) {
            id
            content
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

export const GetComments = gql`
    query getComments($postId: String!) {
        getComments(postId: $postId) {
            id
            content
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

export const GetPaginatedComments = gql`
    query getPaginatedComments($postId: String!, $offset: Int!) {
        getPaginatedComments(postId: $postId, offset: $offset) {
            id
            content
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

export const OnCommentCreated = gql`
    subscription commentCreated {
        commentCreated {
            id
            content
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

export const GetCommentCount = gql`
    query getCommentCount($postId: String!) {
        getCommentCount(postId: $postId)
    }
`;
