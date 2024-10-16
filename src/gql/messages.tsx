import { gql } from "@apollo/client";

export const CreateMessage = gql`
    mutation createMessage($channelId: String!, $content: String!) {
        createMessage(channelId: $channelId, content: $content) {
            id
            content
            edited
            createdAt
            createdTimestamp
            updatedAt
            updatedTimestamp
            channel {
                ... on TextChannel {
                    id
                }
                ... on VoiceChannel {
                    id
                }
                ... on CategoryChannel {
                    id
                }
                ... on DMChannel {
                    id
                }
            }
            embeds {
                title
                description
                url
                image
                media
                author {
                    name
                    url
                    iconUrl
                }
            }
            author {
                id
                username
                displayName
                nameAcronym
                avatar
                defaultAvatar
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
            }
        }
    }
`;

export const EditMessage = gql`
    mutation editMessage($channelId: String!, $id: String!, $content: String!) {
        editMessage(channelId: $channelId, id: $id, content: $content) {
            id
            content
            edited
            createdAt
            createdTimestamp
            updatedAt
            updatedTimestamp
            channel {
                ... on TextChannel {
                    id
                }
                ... on VoiceChannel {
                    id
                }
                ... on CategoryChannel {
                    id
                }
                ... on DMChannel {
                    id
                }
            }
            embeds {
                title
                description
                url
                image
                media
                author {
                    name
                    url
                    iconUrl
                }
            }
            author {
                id
                username
                displayName
                nameAcronym
                avatar
                defaultAvatar
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
            }
        }
    }
`;

export const DeleteMessage = gql`
    mutation deleteMessage($channelId: String!, $id: String!) {
        deleteMessage(channelId: $channelId, id: $id) {
            id
        }
    }
`;

export const GetMessages = gql`
    query getMessages($channelId: String!, $limit: Int, $cursor: String) {
        getMessages(channelId: $channelId, limit: $limit, cursor: $cursor) {
            id
            content
            edited
            createdAt
            createdTimestamp
            updatedAt
            updatedTimestamp
            channel {
                ... on TextChannel {
                    id
                }
                ... on VoiceChannel {
                    id
                }
                ... on CategoryChannel {
                    id
                }
                ... on DMChannel {
                    id
                }
            }
            embeds {
                title
                description
                url
                image
                media
                author {
                    name
                    url
                    iconUrl
                }
            }
            author {
                id
                username
                displayName
                nameAcronym
                avatar
                defaultAvatar
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
            }
        }
    }
`;

export const OnMessageCreated = gql`
    subscription messageCreated($channelId: String!) {
        messageCreated(channelId: $channelId) {
            id
            content
            edited
            createdAt
            createdTimestamp
            updatedAt
            updatedTimestamp
            channel {
                ... on TextChannel {
                    id
                }
                ... on VoiceChannel {
                    id
                }
                ... on CategoryChannel {
                    id
                }
                ... on DMChannel {
                    id
                }
            }
            embeds {
                title
                description
                url
                image
                media
                author {
                    name
                    url
                    iconUrl
                }
            }
            author {
                id
                username
                displayName
                nameAcronym
                avatar
                defaultAvatar
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
            }
        }
    }
`;

export const OnMessageEdited = gql`
    subscription messageEdited($channelId: String!) {
        messageEdited(channelId: $channelId) {
            id
            content
            edited
            createdAt
            createdTimestamp
            updatedAt
            updatedTimestamp

            channel {
                ... on TextChannel {
                    id
                }
                ... on VoiceChannel {
                    id
                }
                ... on CategoryChannel {
                    id
                }
                ... on DMChannel {
                    id
                }
            }
            embeds {
                title
                description
                url
                image
                media
                author {
                    name
                    url
                    iconUrl
                }
            }
            author {
                id
                username
                displayName
                nameAcronym
                avatar
                defaultAvatar
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
            }
        }
    }
`;

export const OnMessageDeleted = gql`
    subscription messageDeleted($channelId: String!) {
        messageDeleted(channelId: $channelId) {
            id
        }
    }
`;
