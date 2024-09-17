import { useQuery } from "@apollo/client";
import { GetMembers } from "@gql/members";
import { Stack } from "@mui/material";

const ChannelMemberList = ({ serverId }: { serverId: string }) => {
    const { data: { getMembers: members } = {} } = useQuery(GetMembers, {
        variables: {
            serverId,
        },
    });

    console.log(members);

    return (
        <Stack direction="column">
            {members?.map((member: any) => (
                <div key={member.id}>{member.user.username}</div>
            ))}
        </Stack>
    );
};

export default ChannelMemberList;