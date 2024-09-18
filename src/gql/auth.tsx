import { gql } from "@apollo/client";

export const LoginUser = gql`
    mutation loginUser($usernameOrEmail: String!, $password: String!) {
        loginUser(
            input: { usernameOrEmail: $usernameOrEmail, password: $password }
        ) {
            token
            id
            username
            email
            avatar
            defaultAvatar
            displayName
            bio
            createdAt
            createdTimestamp
            updatedAt
            updatedTimestamp
            preferences {
                mode
                theme
            }
            activity {
                status
                text
                lastLogin
                lastLoginTimestamp
                lastActive
                lastActiveTimestamp
            }
            type
        }
    }
`;

export const RegisterUser = gql`
    mutation registerUser(
        $username: String!
        $email: String!
        $displayName: String
        $password: String!
        $confirmPassword: String!
        $dateOfBirth: String!
    ) {
        registerUser(
            input: {
                username: $username
                email: $email
                displayName: $displayName
                password: $password
                confirmPassword: $confirmPassword
                dateOfBirth: $dateOfBirth
            }
        )
    }
`;

export const RefreshUser = gql`
    mutation refreshUser($token: String!) {
        refreshUser(token: $token) {
            token
            id
            username
            email
            avatar
            defaultAvatar
            displayName
            bio
            createdAt
            createdTimestamp
            updatedAt
            updatedTimestamp
            preferences {
                mode
                theme
            }
            type
        }
    }
`;
