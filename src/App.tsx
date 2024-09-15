import { Outlet, Route, Routes } from "react-router-dom";

import { LoginPage, NotFound, RegisterPage } from "./shared/pages";
import { useQuery } from "@apollo/client";
import { APIStatus } from "./gql/general";
import { useEffect, useState } from "react";
import APILoading from "./shared/components/status/APILoading";
import APIDown from "./shared/components/status/APIDown";

import PostPage from "./posts/pages/Post";
import ServerLayout from "./servers/ServerLayout";
import PostLayout from "./posts/PostsLayout";
import Layout from "./shared/Layout";
import ChannelPage from "./servers/pages/Channel.page";
import PostsTrending from "./posts/pages/PostsTrending";
import PostsFollowing from "./posts/pages/PostsFollowing";
import { useAppMode } from "./hooks";
import SEO from "./shared/SEO";

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
    if (error) return <APIDown />;

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
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/servers" element={<ServerLayout />}>
                        <Route path=":serverId" element={<Outlet />}>
                            <Route
                                path=":channelId"
                                element={<ChannelPage />}
                            />
                        </Route>
                    </Route>
                    <Route path="/posts" element={<PostLayout />}>
                        <Route path="trending" element={<PostsTrending />} />
                        <Route path="following" element={<PostsFollowing />} />
                        <Route path=":postId" element={<PostPage />} />
                    </Route>
                </Route>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};

export default App;
