import { getDM } from "@/gql/dms";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

const DMsChannelPage = () => {
    const { dmId } = useParams();

    const { data: { getDM: dmChannel } = {} } = useQuery(getDM, {
        variables: {
            id: dmId,
        },
    });

    //console.log(dmChannel);

    return <></>;
};

export default DMsChannelPage;
