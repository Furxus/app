import { createContext, PropsWithChildren } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, logout } from "../reducers/auth";
import { User, UserWithToken } from "@furxus/types";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext<{
    user: User;
    isLoggedIn: boolean;
    login: (userData: any) => void;
    logout: () => void;
}>({
    user: {} as User,
    isLoggedIn: false,
    login: (_userData: any) => void 0,
    logout: () => void 0,
});

export function AuthProvider({ children }: PropsWithChildren) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.auth.user);

    const loginUser = (userData: UserWithToken) => {
        const { token, ...user }: UserWithToken = userData;
        localStorage.setItem("fx-token", token);
        navigate(user.preferences?.mode ?? "servers");
        dispatch(updateUser(user));
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
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
