import { createContext, PropsWithChildren, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, refresh } from "../reducers/auth";
import { MutationFunctionOptions, useMutation } from "@apollo/client";
import { RefreshUser } from "../gql/auth";
import { User, UserWithToken } from "@furxus/types";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext<{
    user: User;
    isLoggedIn: boolean;
    error?: string | null;
    login: (userData: any) => void;
    logout: () => void;
    refresh: (options: MutationFunctionOptions) => void;
}>({
    user: {} as User,
    isLoggedIn: false,
    error: null,
    login: (_userData: any) => void 0,
    logout: () => void 0,
    refresh: (_options: MutationFunctionOptions) => void 0,
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
        onError: (error) => {
            setError(error.message);
        },
    });

    const loginUser = (userData: UserWithToken) => {
        const { token, ...user }: UserWithToken = userData;
        localStorage.setItem("fx-token", token);
        navigate(user.preferences.mode ?? "servers");
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

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn: !!user,
                login: loginUser,
                logout: logoutUser,
                refresh: refreshFunc,
                error,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
