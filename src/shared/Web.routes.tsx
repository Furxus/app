import { Outlet, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import ServerLayout from "@/servers/Servers.layout";
import ChannelPage from "@/servers/pages/Channel.page";
import PostLayout from "@/posts/Posts.layout";
import PostPage from "@/posts/pages/Post.page";
import PostsFollowing from "@/posts/pages/PostsFollowing.page";
import PostsTrending from "@/posts/pages/PostsTrending.page";
import { LoginPage, RegisterPage, NotFound } from "./pages";
import VerifyPage from "./pages/Verify.page";
import DMsLayout from "@/dms/DMs.layout";
import DMChannelPage from "@/dms/DMChannel.page";
import { observer } from "mobx-react-lite";

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
                <Route path="/dms" element={<DMsLayout />}>
                    <Route path=":dmId" element={<DMChannelPage />} />
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

export default observer(WebRoutes);
