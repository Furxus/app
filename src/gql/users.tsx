import { gql } from "@apollo/client";

export const OnUserUpdated = gql`
    subscription userUpdated {
        userUpdated {
            id
            username
            displayName
            nameAcronym
            avatar
            defaultAvatar
        }
    }
`;
