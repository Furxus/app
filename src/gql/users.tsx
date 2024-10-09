import { gql } from "@apollo/client";

export const SendFriendRequest = gql`
    mutation sendFriendRequest($userId: String!) {
        sendFriendRequest(userId: $userId)
    }
`;

export const OnUserUpdated = gql`
    subscription userUpdated {
        userUpdated {
            id
            username
            displayName
            nameAcronym
            friends {
                id
            }
            friendRequests {
                id
            }
            avatar
            defaultAvatar
        }
    }
`;
