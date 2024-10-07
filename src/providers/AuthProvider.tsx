import { createContext, PropsWithChildren, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, refresh } from "../reducers/auth";
import { useMutation } from "@apollo/client";
import { RefreshUser } from "../gql/auth";
import { User, UserWithToken } from "@furxus/types";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext<{
    user: User;
    isLoggedIn: boolean;
    error?: string | null;
    login: (userData: any) => void;
    logout: () => void;
    refresh: () => void;
}>({
    user: {} as User,
    isLoggedIn: false,
    error: null,
    login: (_userData: any) => void 0,
    logout: () => void 0,
    refresh: () => void 0,
});

export function AuthProvider({ children }: PropsWithChildren) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.auth.user);
    const [error, setError] = useState<string | null>(null);
    const [refreshFunc] = useMutation(RefreshUser, {
        onCompleted: ({ refreshUser }: { refreshUser: UserWithToken }) => {
            const { token, ...user }: UserWithToken = refreshUser;
            localStorage.setItem("fx-token", token);
            dispatch(refresh(user));
            localStorage.setItem(
                "refresh_in",
                (Date.now() + 1000 * 60 * 60).toString()
            );
        },
        variables: {
            token: localStorage.getItem("fx-token"),
        },
        onError: (error) => {
            setError(error.message);
        },
    });

    const loginUser = (userData: UserWithToken) => {
        const { token, ...user }: UserWithToken = userData;
        localStorage.setItem("fx-token", token);
        navigate(user.preferences?.mode ?? "servers");
        dispatch(login(user));
        localStorage.setItem(
            "refresh_in",
            (Date.now() + 1000 * 60 * 60).toString()
        );
    };

    const logoutUser = () => {
        localStorage.removeItem("fx-token");
        navigate("/login");
        dispatch(logout());
        localStorage.removeItem("refresh_in");
    };

    const refreshUser = () => {
        refreshFunc({
            variables: {
                token: localStorage.getItem("fx-token"),
            },
        });
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn: !!user,
                login: loginUser,
                logout: logoutUser,
                refresh: refreshUser,
                error,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
