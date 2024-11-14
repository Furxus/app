import { ChannelTypeIcons } from "@utils";
import classNames from "classnames";
import { useLocation, useNavigate } from "react-router-dom";

import { FaTrash } from "react-icons/fa";
import { Server, VoiceChannel } from "@furxus/types";
import { useAuth } from "@hooks";
import { Item, Menu, useContextMenu } from "react-contexify";
import Stack from "@mui/material/Stack";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";

const ChannelVoiceListItem = ({
    server,
    channel,
}: {
    server: Server;
    channel: VoiceChannel;
}) => {
    const { user } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const isActive = location.pathname.includes(channel?.id);

    const { mutate: deleteChannel } = useMutation({
        mutationKey: [
            "deleteChannel",
            { serverId: server.id, channelId: channel?.id },
        ],
        mutationFn: () =>
            api.delete(`/channels/${channel?.id}`).then((res) => res.data),
        onSuccess: () => {
            navigate(`/servers/${server.id}`);
        },
    });

    const { show } = useContextMenu();

    // Keep this for now since they are no permission system created
    const showMenu = (event: any) => {
        event.stopPropagation();
        if (user?.id === server.owner?.id) {
            show({
                id: "channel-actions",
                event,
            });
        }
    };

    const userAlreadyInChannel = channel.voiceStates.some(
        (vs) => vs.user.id === user.id
    );

    const onClick = () => {
        if (!userAlreadyInChannel) return;
    };

    if (!channel) return <></>;

    return (
        <>
            <Stack
                direction="row"
                justifyContent="flex-start"
                mt={1}
                py={0.5}
                alignItems="center"
                px={1}
                onContextMenu={showMenu}
                className={classNames(
                    "w-full",
                    "hover:bg-neutral-600/40",
                    "rounded-md",
                    "transition-colors",
                    "duration-150",
                    {
                        "bg-neutral-600/40": isActive,
                        "cursor-pointer": !isActive || !userAlreadyInChannel,
                    }
                )}
                gap={0.5}
                onClick={onClick}
            >
                {ChannelTypeIcons[channel.type]} {channel.name}
            </Stack>
            <Menu id="channel-actions">
                {user?.id === server.owner?.id && (
                    <Item
                        onClick={() => {
                            deleteChannel();
                        }}
                    >
                        <FaTrash className="mr-2" />
                        Delete Channel
                    </Item>
                )}
            </Menu>
        </>
    );
};

export default ChannelVoiceListItem;
