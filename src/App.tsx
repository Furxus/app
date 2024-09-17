import { useQuery } from "@apollo/client";
import { APIStatus } from "./gql/general";
import { useEffect, useState } from "react";
import APILoading from "./shared/components/status/APILoading";

import { useAppMode } from "./hooks";
import SEO from "./shared/SEO";
import WebRoutes from "./shared/Web.routes";

const App = () => {
    const { appMode } = useAppMode();
    const [apiStatus, setApiStatus] = useState(false);

    const { loading, error } = useQuery(APIStatus, {
        pollInterval: apiStatus ? 50000 : 1000,
        fetchPolicy: "no-cache",
    });

    useEffect(() => {
        if (!error) setApiStatus(true);
    }, [error]);

    if (loading) return <APILoading />;

    return (
        <>
            <SEO
                title={
                    appMode
                        ? appMode === "servers"
                            ? "Furxus - Servers"
                            : "Furxus - Posts"
                        : "Furxus - Furry Nexus"
                }
                image={
                    appMode
                        ? appMode === "servers"
                            ? "/logo2.png"
                            : "/logo.png"
                        : "/logo.png"
                }
            />
            <WebRoutes />
        </>
    );
};

export default App;
