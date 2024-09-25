import { gql } from "@apollo/client";

export const CreateServer = gql`
    mutation createServer($name: String!, $icon: Upload) {
        createServer(name: $name, icon: $icon) {
            id
            name
            nameAcronym
            icon
            owner {
                id
            }
            channels {
                id
            }
            members {
                user {
                    id
                }
                permissions
            }
        }
    }
`;

export const JoinServer = gql`
    mutation joinServer($code: String!) {
        joinServer(code: $code) {
            id
            name
            nameAcronym
            icon
            owner {
                id
            }
            channels {
                id
            }
            members {
                user {
                    id
                }
                permissions
            }
        }
    }
`;

export const LeaveServer = gql`
    mutation leaveServer($id: String!) {
        leaveServer(id: $id) {
            id
            name
            nameAcronym
            icon
            owner {
                id
            }
            channels {
                id
            }
            members {
                user {
                    id
                }
                permissions
            }
        }
    }
`;

export const DeleteServer = gql`
    mutation deleteServer($id: String!) {
        deleteServer(id: $id) {
            id
        }
    }
`;

export const GetUserServers = gql`
    query getUserServers {
        getUserServers {
            id
            name
            nameAcronym
            icon
            owner {
                id
            }
            channels {
                id
            }
            members {
                user {
                    id
                }
                permissions
            }
        }
    }
`;

export const GetUserServer = gql`
    query getUserServer($id: String!) {
        getUserServer(id: $id) {
            id
            name
            nameAcronym
            icon
            owner {
                id
            }
            channels {
                id
            }
            members {
                user {
                    id
                }
                permissions
            }
        }
    }
`;

export const GetServerSidebarInfo = gql`
    query getServerSidebarInfo($id: String!) {
        getServer(id: $id) {
            id
            name
            nameAcronym
            icon
            owner {
                id
            }
            channels {
                id
            }
            members {
                user {
                    id
                }
                permissions
            }
        }
    }
`;

export const GetServerInvites = gql`
    query getServerInvites($id: String!) {
        getServerSettings(id: $id) {
            invites {
                code
                uses
                maxUses
                createdBy {
                    id
                    username
                    displayName
                    avatar
                    defaultAvatar
                }
                expiresAt
                createdAt
            }
        }
    }
`;

export const OnServerCreated = gql`
    subscription serverCreated($userId: String!) {
        serverCreated(userId: $userId) {
            id
            name
            nameAcronym
            icon
            owner {
                id
            }
            channels {
                id
            }
            members {
                user {
                    id
                }
                permissions
            }
        }
    }
`;

export const OnServerJoined = gql`
    subscription serverJoined($userId: String!) {
        serverJoined(userId: $userId) {
            id
            name
            nameAcronym
            icon
            owner {
                id
            }
            channels {
                id
            }
            members {
                user {
                    id
                }
                permissions
            }
        }
    }
`;

export const OnServerLeft = gql`
    subscription serverLeft($userId: String!) {
        serverLeft(userId: $userId) {
            id
        }
    }
`;

export const OnServerDeleted = gql`
    subscription serverDeleted($userId: String!) {
        serverDeleted(userId: $userId) {
            id
        }
    }
`;
