import { createContext, PropsWithChildren, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, logout } from "../reducers/auth";
import { User, UserWithToken } from "@furxus/types";
import { useNavigate } from "react-router-dom";
import { api, socket } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const AuthContext = createContext<{
    user: User;
    isLoggedIn: boolean;
    error?: string | null;
    login: (token: UserWithToken) => void;
    logout: () => void;
}>({
    user: {} as User,
    isLoggedIn: false,
    error: null,
    login: (_userData: UserWithToken) => void 0,
    logout: () => void 0,
});

export function AuthProvider({ children }: PropsWithChildren) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.auth.user);

    const token = localStorage.getItem("token");

    const { data: meData } = useQuery({
        queryKey: ["me"],
        queryFn: () => api.get("/@me").then((res) => res.data),
        retry: 5,
        enabled: !!token,
        refetchInterval: 300000,
    });

    useEffect(() => {
        if (meData) {
            dispatch(updateUser(meData));
        }
    }, [meData]);

    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        socket.auth = { token: token };
    }

    useEffect(() => {
        socket.on("me:update", (user: User) => {
            dispatch(updateUser(user));
        });

        return () => {
            socket.off("me:update");
        };
    }, []);

    const loginUser = (userData: UserWithToken) => {
        const { token, ...user } = userData;
        localStorage.setItem("token", token);
        navigate(user.preferences.mode ?? "servers");
        dispatch(updateUser(user));
    };

    const logoutUser = () => {
        localStorage.removeItem("token");
        dispatch(logout());
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn: !!user,
                login: loginUser,
                logout: logoutUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
