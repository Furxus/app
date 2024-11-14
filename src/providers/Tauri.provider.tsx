import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { getCurrentWindow, Window } from "@tauri-apps/api/window";

export const TauriContext = createContext<{
    inTauri: boolean;
    window: Window | null;
}>({
    inTauri: false,
    window: null,
});

export function TauriProvider({ children }: PropsWithChildren) {
    const [inTauri, setInTauri] = useState(false);
    const [tWindow, setWindow] = useState<Window | null>(null);

    useEffect(() => {
        try {
            const appWindow = getCurrentWindow();
            setWindow(appWindow);
            setInTauri(true);
        } catch {
            setInTauri(false);
        }
    }, []);

    return (
        <TauriContext.Provider value={{ inTauri, window: tWindow }}>
            {children}
        </TauriContext.Provider>
    );
}
