import { useParams } from "react-router-dom";

const DMsChannelPage = () => {
    const { dmChannelId } = useParams();

    return <div key="friend-channel-page">{dmChannelId}</div>;
};

export default DMsChannelPage;
