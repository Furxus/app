import { gql } from "@apollo/client";

export const SendFriendRequest = gql`
    mutation sendFriendRequest($userId: String!) {
        sendFriendRequest(userId: $userId)
    }
`;

export const CancelFriendRequest = gql`
    mutation cancelFriendRequest($userId: String!) {
        cancelFriendRequest(userId: $userId)
    }
`;

export const GetUser = gql`
    query getUser($id: String!) {
        getUser(id: $id) {
            id
            username
            displayName
            nameAcronym
            friends {
                id
            }
            friendRequests {
                sent {
                    id
                }
                received {
                    id
                }
            }
            avatar
            defaultAvatar
        }
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
                sent {
                    id
                }
                received {
                    id
                }
            }
            avatar
            defaultAvatar
        }
    }
`;
