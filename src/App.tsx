import APILoading from "./shared/components/status/APILoading.component";

import { useAuth, useTauri } from "./hooks";
import SEO from "./shared/SEO";
import WebRoutes from "./shared/Web.routes";

import { useQuery } from "@tanstack/react-query";
import { api } from "./api";
import Titlebar from "./shared/Titlebar";
import { Stack } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useAppStore } from "./hooks/useAppStore";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const App = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { appMode } = useAppStore();
    const { inTauri } = useTauri();

    const { isLoading, error } = useQuery({
        queryKey: ["ack"],
        queryFn: () => api.get("/ack").then((res) => res.data),
        retry: Infinity,
    });

    useEffect(() => {
        if (location.pathname.includes("/servers")) {
            appMode.set("servers");
            return;
        }
        if (location.pathname.includes("/posts")) {
            appMode.set("posts");
            return;
        }
        if (location.pathname.includes("/dms")) {
            appMode.set("dms");
            return;
        }

        appMode.set(null);
    }, [location.pathname]);

    useEffect(() => {
        if (user && location.pathname === "/") {
            appMode.switch(user.preferences.mode ?? "servers", navigate);
        }
    }, [user, user?.preferences.mode]);

    if (error) return <APILoading />;
    if (isLoading) return <APILoading />;

    let title = "Furxus - Furry Nexus";
    let favicon = "/favicon.ico";

    switch (appMode.mode) {
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

export default observer(App);
