import { gql } from "@apollo/client";

export const getDMs = gql`
    query getDMs {
        getDMs {
            id
            recipient1 {
                id
                username
                displayName
                nameAcronym
                avatar
                defaultAvatar
            }
            recipient2 {
                id
                username
                displayName
                nameAcronym
                avatar
                defaultAvatar
            }
            createdAt
            createdTimestamp
        }
    }
`;

export const getDM = gql`
    query getDM($id: String!) {
        getDM(id: $id) {
            id
            recipient1 {
                id
                username
                displayName
                nameAcronym
                avatar
                defaultAvatar
            }
            recipient2 {
                id
                username
                displayName
                nameAcronym
                avatar
                defaultAvatar
            }
            createdAt
            createdTimestamp
        }
    }
`;

export const OpenDMChannel = gql`
    mutation openDMChannel($recipient: String!) {
        openDMChannel(recipient: $recipient) {
            id
            recipient1 {
                id
                username
                displayName
                nameAcronym
                avatar
                defaultAvatar
            }
            recipient2 {
                id
                username
                displayName
                nameAcronym
                avatar
                defaultAvatar
            }
            createdAt
            createdTimestamp
        }
    }
`;
