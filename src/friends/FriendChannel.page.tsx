import { useParams } from "react-router-dom";

const FriendChannelPage = () => {
    const { friendChannelId } = useParams();

    return <div key="friend-channel-page">{friendChannelId}</div>;
};

export default FriendChannelPage;
