import { ChannelTypeIcons } from "@utils";
import classNames from "classnames";
import { useLocation, useNavigate } from "react-router-dom";

import { FaTrash } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import { DeleteChannel } from "@gql/channels";
import { BaseServerChannel, Server } from "@furxus/types";
import { useAuth } from "@hooks";
import { Item, Menu, useContextMenu } from "react-contexify";
import Stack from "@mui/material/Stack";

const ChannelTextListItem = ({
    server,
    channel,
}: {
    server: Server;
    channel: BaseServerChannel;
}) => {
    const { user } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const isActive = location.pathname.includes(channel.id);

    const [deleteChannel] = useMutation(DeleteChannel, {
        variables: {
            serverId: server.id,
            id: channel.id,
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
                        "cursor-pointer": !isActive && channel.type === "text",
                    }
                )}
                gap={0.5}
                onClick={() => {
                    if (!isActive && channel.type === "text")
                        navigate(`/servers/${server.id}/${channel.id}`);
                }}
            >
                {ChannelTypeIcons[channel.type ?? "text"]} {channel.name}
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

export default ChannelTextListItem;
