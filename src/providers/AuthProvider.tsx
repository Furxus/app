import { createContext, PropsWithChildren } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, logout } from "../reducers/auth";
import { User, UserWithToken } from "@furxus/types";
import { useNavigate } from "react-router-dom";
import { api, socket } from "@/api";

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

    // const [fetchMe] = useLazyQuery(FetchMe, {
    //     onCompleted: ({ me }: { me: User }) => {
    //         dispatch(updateUser(me));
    //     },
    //     onError: (error) => {
    //         setError(error.message);
    //     },
    //     pollInterval: 10000,
    // });

    // useSubscription(OnUserUpdated, {
    //     onData: () => {
    //         fetchMe();
    //     },
    // });

    const token = localStorage.getItem("fx-token");

    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        socket.auth = { token: token };
    }

    const loginUser = (userData: UserWithToken) => {
        const { token, ...user } = userData;
        localStorage.setItem("fx-token", token);
        navigate(user.preferences.mode ?? "servers");
        dispatch(updateUser(user));
    };

    const logoutUser = () => {
        localStorage.removeItem("fx-token");
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
