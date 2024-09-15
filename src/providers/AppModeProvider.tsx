import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

export const AppModeContext = createContext<{
    appMode: string | null;
    setAppMode: (appMode: string) => void;
    changeAppMode: (appMode: string) => void;
}>({
    appMode: "servers",
    setAppMode: (_appMode: string) => void 0,
    changeAppMode: (_appMode: string) => void 0,
});

export function AppModeProvider({ children }: PropsWithChildren) {
    const location = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn, user, refresh } = useContext(AuthContext);
    const [appMode, setAppMode] = useState<string | null>(
        user?.preferences?.mode ?? null
    );

    useEffect(() => {
        if (
            user &&
            parseInt(localStorage.getItem("refresh_in") ?? "") < Date.now()
        ) {
            refresh({
                variables: {
                    token: localStorage.getItem("fx-token"),
                },
            });

            localStorage.setItem(
                "refresh_in",
                (Date.now() + 1000 * 60 * 60).toString()
            );
        }
    }, [location.pathname]);

    useEffect(() => {
        if (isLoggedIn && location.pathname === "/" && user)
            navigate(user.preferences.mode);

        if (
            !isLoggedIn &&
            !location.pathname.includes("login") &&
            !location.pathname.includes("register")
        )
            navigate("/login");

        if (location.pathname.includes("servers")) setAppMode("servers");
        if (location.pathname.includes("posts")) setAppMode("posts");

        return () => {};
    }, [isLoggedIn, appMode, location.pathname, user]);

    const changeAppMode = (appMode: string) => {
        setAppMode(appMode);
        navigate(appMode);
    };

    return (
        <AppModeContext.Provider value={{ appMode, setAppMode, changeAppMode }}>
            {children}
        </AppModeContext.Provider>
    );
}
