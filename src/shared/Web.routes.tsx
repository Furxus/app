import { Outlet, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import ServerLayout from "@/servers/ServerLayout";
import ChannelPage from "@/servers/pages/Channel.page";
import PostLayout from "@/posts/PostsLayout";
import PostPage from "@/posts/pages/Post";
import PostsFollowing from "@/posts/pages/PostsFollowing";
import PostsTrending from "@/posts/pages/PostsTrending";
import { LoginPage, RegisterPage, NotFound } from "./pages";
import VerifyPage from "./pages/Verify.page";

const WebRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="/servers" element={<ServerLayout />}>
                    <Route path=":serverId" element={<Outlet />}>
                        <Route path=":channelId" element={<ChannelPage />} />
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
            <Route path="verify">
                <Route path=":code" element={<VerifyPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default WebRoutes;
