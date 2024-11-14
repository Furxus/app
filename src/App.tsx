import APILoading from "./shared/components/status/APILoading.component";

import { useAppMode, useTauri } from "./hooks";
import SEO from "./shared/SEO";
import WebRoutes from "./shared/Web.routes";

import { useQuery } from "@tanstack/react-query";
import { api } from "./api";
import Titlebar from "./shared/Titlebar";
import { Stack } from "@mui/material";

const App = () => {
    const { appMode } = useAppMode();
    const { inTauri } = useTauri();

    const { isLoading, error } = useQuery({
        queryKey: ["ack"],
        queryFn: () => api.get("/ack").then((res) => res.data),
        retry: Infinity,
    });

    if (error) return <APILoading />;
    if (isLoading) return <APILoading />;

    let title = "Furxus - Furry Nexus";
    let favicon = "/favicon.ico";

    switch (appMode) {
        case "servers":
            title = "Furxus - Servers";
            favicon = "/logo2.png";
            break;
        case "posts":
            title = "Furxus - Posts";
            favicon = "/logo.png";
            break;
        case "dms":
            title = "Furxus - Direct Messages";
            favicon = "/favicon.ico";
            break;
        default:
            break;
    }

    return (
        <Stack className="w-full h-full">
            {inTauri && <Titlebar />}
            <SEO title={title} image={favicon} />
            <WebRoutes />
        </Stack>
    );
};

export default App;
