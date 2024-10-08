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
