import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

type AppModes = "servers" | "posts" | "dms";

export const AppModeContext = createContext<{
    appMode: AppModes;
    setAppMode: (appMode: AppModes) => void;
    changeAppMode: (appMode: AppModes) => void;
}>({
    appMode: "servers",
    setAppMode: (_appMode: AppModes) => void 0,
    changeAppMode: (_appMode: AppModes) => void 0,
});

export function AppModeProvider({ children }: PropsWithChildren) {
    const location = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn, user, refresh } = useContext(AuthContext);
    const [appMode, setAppMode] = useState<AppModes>(
        user?.preferences?.mode ?? "servers"
    );

    useEffect(() => {
        if (
            user &&
            parseInt(localStorage.getItem("refresh_in") ?? "0") < Date.now()
        ) {
            refresh();

            localStorage.setItem(
                "refresh_in",
                (Date.now() + 1000 * 60 * 60).toString()
            );
        }
    }, [location.pathname]);

    useEffect(() => {
        if (isLoggedIn && location.pathname === "/" && user)
            navigate(user.preferences?.mode ?? "servers");

        if (
            !isLoggedIn &&
            !location.pathname.includes("login") &&
            !location.pathname.includes("register") &&
            !location.pathname.includes("verify")
        )
            navigate("/login");

        if (location.pathname.includes("servers")) setAppMode("servers");
        if (location.pathname.includes("posts")) setAppMode("posts");
        if (location.pathname.includes("dms")) setAppMode("dms");

        return () => {};
    }, [isLoggedIn, appMode, location.pathname, user]);

    const changeAppMode = (appMode: AppModes) => {
        setAppMode(appMode);
        navigate(appMode);
    };

    return (
        <AppModeContext.Provider value={{ appMode, setAppMode, changeAppMode }}>
            {children}
        </AppModeContext.Provider>
    );
}
