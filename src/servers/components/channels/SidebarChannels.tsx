import { useState } from "react";

import { Channel, Server } from "@furxus/types";
import { useAuth } from "../../../hooks";
import { FaPlus } from "react-icons/fa";

import ScrollableFeed from "react-scrollable-feed";
import CreateChannelModal from "./CreateChannelModal";
import ChannelTextListItem from "./ChannelTextListItem";

import { Item, Menu, useContextMenu } from "react-contexify";
import Stack from "@mui/material/Stack";

const ServerSidebarChannels = ({
    server,
    channels,
}: {
    server: Server;
    channels: Channel[];
}) => {
    const { user } = useAuth();
    const [visible, setVisible] = useState(false);

    const { show } = useContextMenu();

    // Keep this for now since they are no permission system created
    const showMenu = (event: any) => {
        event.stopPropagation();
        if (user?.id === server.owner.id) {
            show({
                id: "sidebar-channels-menu",
                event,
            });
        }
    };

    return (
        <>
            <ScrollableFeed className="w-full">
                <Stack
                    px="0.5rem"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    gap={1}
                    onContextMenu={showMenu}
                    className="w-full h-full flex-grow pt-14"
                >
                    {channels.map((channel: any) => (
                        <ChannelTextListItem
                            key={channel.id}
                            channel={channel}
                            server={server}
                        />
                    ))}
                </Stack>
            </ScrollableFeed>
            <Menu id="sidebar-channels-menu">
                {user?.id === server.owner.id && (
                    <Item onClick={() => setVisible(true)}>
                        <FaPlus className="mr-2" />
                        Create Channel
                    </Item>
                )}
            </Menu>
            <CreateChannelModal
                serverId={server.id}
                visible={visible}
                setVisible={setVisible}
            />
        </>
    );
};

export default ServerSidebarChannels;

/**
 *  <ScrollContainer>
                <Stack
                    px="0.5rem"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    gap={1}
                    className="w-full h-full overflow-y-auto flex-grow mt-14"
                >
                    {channels.map((channel: any) => (
                        <ChannelTextListItem
                            key={channel.id}
                            channel={channel}
                            server={server}
                        />
                    ))}
                </Stack>
            </ScrollContainer>
 */
