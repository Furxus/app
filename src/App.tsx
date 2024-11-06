import { useEffect, useState } from "react";
import APILoading from "./shared/components/status/APILoading";

import { useAppMode } from "./hooks";
import SEO from "./shared/SEO";
import WebRoutes from "./shared/Web.routes";

import { useQuery } from "@tanstack/react-query";
import { api, socket } from "./api";

const App = () => {
    const { appMode } = useAppMode();

    const { isLoading, error } = useQuery({
        queryKey: ["ack"],
        queryFn: () => api.get("/ack").then((res) => res.data),
        retry: 5,
    });

    useEffect(() => {
        socket.connect();
    }, []);

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
        <>
            <SEO title={title} image={favicon} />
            <WebRoutes />
        </>
    );
};

export default App;
