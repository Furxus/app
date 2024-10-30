import { createContext, PropsWithChildren, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, logout } from "../reducers/auth";
import { useLazyQuery, useSubscription } from "@apollo/client";
import { FetchMe } from "../gql/auth";
import { User, UserWithToken } from "@furxus/types";
import { useNavigate } from "react-router-dom";
import { OnUserUpdated } from "@/gql/users";

export const AuthContext = createContext<{
    user: User;
    isLoggedIn: boolean;
    error?: string | null;
    login: (userData: any) => void;
    logout: () => void;
    fetchMe: () => void;
}>({
    user: {} as User,
    isLoggedIn: false,
    error: null,
    login: (_userData: any) => void 0,
    logout: () => void 0,
    fetchMe: () => void 0,
});

export function AuthProvider({ children }: PropsWithChildren) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.auth.user);
    const [error, setError] = useState<string | null>(null);

    const [fetchMe] = useLazyQuery(FetchMe, {
        onCompleted: ({ me }: { me: User }) => {
            dispatch(updateUser(me));
        },
        onError: (error) => {
            setError(error.message);
        },
        pollInterval: 10000,
    });

    useSubscription(OnUserUpdated, {
        onData: () => {
            fetchMe();
        },
    });

    const loginUser = (userData: UserWithToken) => {
        const { token, ...user } = userData;
        localStorage.setItem("fx-token", token);
        navigate(user.preferences?.mode ?? "servers");
        dispatch(updateUser(user));
    };

    const logoutUser = () => {
        localStorage.removeItem("fx-token");
        navigate("/login");
        dispatch(logout());
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn: !!user,
                login: loginUser,
                logout: logoutUser,
                fetchMe,
                error,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
