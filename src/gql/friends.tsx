import { gql } from "@apollo/client";

export const GetFriends = gql`
    query getFriends {
        getFriends {
            id
            username
            avatar
            defaultAvatar
            displayName
        }
    }
`;

export const GetFriendChannels = gql`
    query getFriendChannels($userId: String!) {
        getFriendChannels(userId: $userId) {
            id
            participants {
                id
                username
                avatar
                defaultAvatar
            }
            messages {
                id
                content
                edited
                createdAt
                createdTimestamp
                updatedAt
                updatedTimestamp
                member {
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
        }
    }
`;

export const SendFriendRequest = gql`
    mutation sendFriendRequest($userId: String!) {
        sendFriendRequest(userId: $userId)
    }
`;

export const AcceptFriendRequest = gql`
    mutation acceptFriendRequest($userId: String!) {
        acceptFriendRequest(userId: $userId)
    }
`;

export const RemoveFriend = gql`
    mutation removeFriend($userId: String!) {
        removeFriend(userId: $userId)
    }
`;
