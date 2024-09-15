import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { platform as platformFunc } from "@tauri-apps/plugin-os";

type Platform = "web" | "mobile";

export const PlatformContext = createContext<{
    platform: Platform;
    setPlatform: (platform: Platform) => void;
}>({
    platform: "web",
    setPlatform: (_platform: Platform) => void 0,
});

export function PlatformProvider({ children }: PropsWithChildren) {
    const [platform, setPlatform] = useState<Platform>("web");

    useEffect(() => {
        if (window.__TAURI_OS_PLUGIN_INTERNALS__) {
            const platformValue = platformFunc();
            if (platformValue === "ios" || platformValue === "android") {
                setPlatform("mobile");
            } else {
                setPlatform("web");
            }
        }
    }, []);

    console.log("Platform:", platform);

    return (
        <PlatformContext.Provider value={{ platform, setPlatform }}>
            {children}
        </PlatformContext.Provider>
    );
}
