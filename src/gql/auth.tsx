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
            verified
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
            verified
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

export const VerifyUser = gql`
    query verifyUser($code: String!) {
        verifyUser(code: $code)
    }
`;

export const ResendEmail = gql`
    mutation resendEmail {
        resendEmail
    }
`;

export const UpdateAvatar = gql`
    mutation updateAvatar($avatar: Upload!) {
        updateAvatar(avatar: $avatar)
    }
`;

export const UpdateDefaultAvatar = gql`
    mutation updateDefaultAvatar($avatar: String!) {
        updateDefaultAvatar(avatar: $avatar)
    }
`;

export const UpdateAvatarFromURL = gql`
    mutation updateAvatarFromURL($avatar: String!) {
        updateAvatarFromURL(avatar: $avatar)
    }
`;

export const GetPreviousAvatars = gql`
    query getPreviousAvatars {
        getPreviousAvatars
    }
`;
