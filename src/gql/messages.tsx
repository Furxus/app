import { gql } from "@apollo/client";

export const CreateMessage = gql`
    mutation createMessage(
        $serverId: String!
        $channelId: String!
        $content: String!
    ) {
        createMessage(
            serverId: $serverId
            channelId: $channelId
            content: $content
        ) {
            id
            content
            edited
            createdAt
            createdTimestamp
            updatedAt
            updatedTimestamp
            server {
                id
            }
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
            member {
                user {
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
    }
`;

export const EditMessage = gql`
    mutation editMessage(
        $serverId: String!
        $channelId: String!
        $id: String!
        $content: String!
    ) {
        editMessage(
            serverId: $serverId
            channelId: $channelId
            id: $id
            content: $content
        ) {
            id
            content
            edited
            createdAt
            createdTimestamp
            updatedAt
            updatedTimestamp
            server {
                id
            }
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
            member {
                user {
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
    }
`;

export const DeleteMessage = gql`
    mutation deleteMessage(
        $serverId: String!
        $channelId: String!
        $id: String!
    ) {
        deleteMessage(serverId: $serverId, channelId: $channelId, id: $id) {
            id
        }
    }
`;

export const GetMessages = gql`
    query getMessages($serverId: String!, $channelId: String!) {
        getMessages(serverId: $serverId, channelId: $channelId) {
            id
            content
            edited
            createdAt
            createdTimestamp
            updatedAt
            updatedTimestamp
            server {
                id
            }
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
            member {
                user {
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
    }
`;

export const OnMessageCreated = gql`
    subscription messageCreated($serverId: String!, $channelId: String!) {
        messageCreated(serverId: $serverId, channelId: $channelId) {
            id
            content
            edited
            createdAt
            createdTimestamp
            updatedAt
            updatedTimestamp
            server {
                id
            }
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
            member {
                user {
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
    }
`;

export const OnMessageEdited = gql`
    subscription messageEdited($serverId: String!, $channelId: String!) {
        messageEdited(serverId: $serverId, channelId: $channelId) {
            id
            content
            edited
            createdAt
            createdTimestamp
            updatedAt
            updatedTimestamp
            server {
                id
            }
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
            member {
                user {
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
    }
`;

export const OnMessageDeleted = gql`
    subscription messageDeleted($serverId: String!, $channelId: String!) {
        messageDeleted(serverId: $serverId, channelId: $channelId) {
            id
        }
    }
`;
