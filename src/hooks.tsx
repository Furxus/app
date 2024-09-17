import { useContext } from "react";
import { AuthContext } from "./providers/AuthProvider";
import { AppModeContext } from "./providers/AppModeProvider";

export function useAuth() {
    const value = useContext(AuthContext);

    if (process.env.NODE_ENV === "development" && value === undefined)
        throw new Error("useAuth must be used within an AuthProvider");

    return value;
}

export function useAppMode() {
    const value = useContext(AppModeContext);

    if (process.env.NODE_ENV === "development" && value === undefined)
        throw new Error("useAppMode must be used within a AppModeProvider");

    return value;
}
