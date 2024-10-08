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
