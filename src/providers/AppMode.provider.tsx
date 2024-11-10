import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./Auth.provider";

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
    const { user } = useContext(AuthContext);
    const [appMode, setAppMode] = useState<AppModes>(
        user?.preferences?.mode ?? "servers"
    );

    useEffect(() => {
        if (location.pathname.includes("servers")) setAppMode("servers");
        if (location.pathname.includes("posts")) setAppMode("posts");
        if (location.pathname.includes("dms")) setAppMode("dms");

        if (location.pathname === "/" && user) navigate(appMode);

        return () => {};
    }, [appMode, location.pathname]);

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
