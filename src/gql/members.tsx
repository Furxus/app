import { gql } from "@apollo/client";

export const GetMembers = gql`
    query getMembers($serverId: String!) {
        getMembers(serverId: $serverId) {
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
