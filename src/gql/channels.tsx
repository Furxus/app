import { gql } from "@apollo/client";

export const OnChannelCreated = gql`
    subscription channelCreated($serverId: String!) {
        channelCreated(serverId: $serverId) {
            id
            name
            type
            position
        }
    }
`;

export const OnChannelDeleted = gql`
    subscription channelDeleted($serverId: String!) {
        channelDeleted(serverId: $serverId) {
            id
            name
            type
            position
        }
    }
`;

export const DeleteChannel = gql`
    mutation deleteChannel($serverId: String!, $id: String!) {
        deleteChannel(serverId: $serverId, id: $id) {
            id
        }
    }
`;

export const CreateChannel = gql`
    mutation createChannel($serverId: String!, $name: String!, $type: String!) {
        createChannel(serverId: $serverId, name: $name, type: $type) {
            id
            name
            type
            position
        }
    }
`;

export const GetChannels = gql`
    query getChannels($serverId: String!, $type: [String]) {
        getChannels(serverId: $serverId, type: $type) {
            id
            name
            type
            position
        }
    }
`;

export const GetChannel = gql`
    query getChannel($serverId: String!, $id: String!) {
        getChannel(serverId: $serverId, id: $id) {
            id
            name
            type
            position
        }
    }
`;
