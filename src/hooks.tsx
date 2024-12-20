import { useContext, useEffect } from "react";
import { AuthContext } from "./providers/Auth.provider";
import { UserServersContext } from "./providers/UserServers.provider";
import { UserEmojisContext } from "./providers/UserEmojis.provider";
import { TauriContext } from "./providers/Tauri.provider";
import { EmojisProviderContext } from "./providers/Emojis.provider";

export function useAuth() {
    const value = useContext(AuthContext);

    if (process.env.NODE_ENV === "development" && value === undefined)
        throw new Error("useAuth must be used within an AuthProvider");

    return value;
}

export function useTauri() {
    const value = useContext(TauriContext);

    if (process.env.NODE_ENV === "development" && value === undefined)
        throw new Error("useTauri must be used within a TauriProvider");

    return value;
}

export function useUserServers() {
    const value = useContext(UserServersContext);

    if (process.env.NODE_ENV === "development" && value === undefined)
        throw new Error(
            "useUserServers must be used within a UserServersProvider"
        );

    return value;
}

export function useUserEmojis() {
    const value = useContext(UserEmojisContext);

    if (process.env.NODE_ENV === "development" && value === undefined)
        throw new Error(
            "useUserEmojis must be used within a UserEmojisProvider"
        );

    return value;
}

export function useEmojis() {
    const value = useContext(EmojisProviderContext);

    if (process.env.NODE_ENV === "development" && value === undefined)
        throw new Error("useEmojis must be used within a EmojisProvider");

    return value;
}

export function useClickOutside(ref: any, handler: any) {
    useEffect(() => {
        let startedInside = false;
        let startedWhenMounted = false;

        const listener = (event: any) => {
            // Do nothing if `mousedown` or `touchstart` started inside ref element
            if (startedInside || !startedWhenMounted) return;
            // Do nothing if clicking ref's element or descendent elements
            if (!ref.current || ref.current.contains(event.target)) return;

            handler(event);
        };

        const validateEventStart = (event: any) => {
            startedWhenMounted = ref.current;
            startedInside = ref.current && ref.current.contains(event.target);
        };

        document.addEventListener("mousedown", validateEventStart);
        document.addEventListener("touchstart", validateEventStart);
        document.addEventListener("click", listener);

        return () => {
            document.removeEventListener("mousedown", validateEventStart);
            document.removeEventListener("touchstart", validateEventStart);
            document.removeEventListener("click", listener);
        };
    }, [ref, handler]);
}
