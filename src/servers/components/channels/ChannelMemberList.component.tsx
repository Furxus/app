import { api } from "@/api";
import Stack from "@mui/material/Stack";
import { useQuery } from "@tanstack/react-query";

const ChannelMemberList = ({ serverId }: { serverId: string }) => {
    const { isLoading, data: members } = useQuery({
        queryKey: ["getMembers", { serverId }],
        queryFn: () =>
            api.get(`/servers/${serverId}/members`).then((res) => res.data),
    });

    if (isLoading) return <></>;

    return (
        <Stack direction="column">
            {members?.map((member: any) => (
                <div key={member.id}>{member.user.username}</div>
            ))}
        </Stack>
    );
};

export default ChannelMemberList;
