import { GetFriends } from "@/gql/friends";
import { useQuery } from "@apollo/client";

const SidebarFriends = () => {
    const { data: { getFriends: friends = [] } = {} } = useQuery(GetFriends);

    console.log(friends);

    return <></>;
};

export default SidebarFriends;
