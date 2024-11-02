import { useQuery } from "@apollo/client";
import { APIStatus } from "./gql/general";
import { useEffect, useState } from "react";
import APILoading from "./shared/components/status/APILoading";

import { useAppMode } from "./hooks";
import SEO from "./shared/SEO";
import WebRoutes from "./shared/Web.routes";
import { socket } from "./providers/MainProvider";

const App = () => {
    const { appMode } = useAppMode();
    const [apiStatus, setApiStatus] = useState(true);

    const { loading, error } = useQuery(APIStatus, {
        pollInterval: apiStatus ? 50000 : 1000,
        fetchPolicy: "no-cache",
    });

    useEffect(() => {
        if (loading) setApiStatus(false);
        if (!error) setApiStatus(true);
    }, [error, loading]);

    useEffect(() => {
        if (!loading && !error) socket.connect();
    }, [loading, error]);

    if (loading) return <APILoading />;

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
