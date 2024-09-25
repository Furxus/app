import { useEffect, useState } from "react";

import { Channel, Server } from "@furxus/types";
import { useAuth } from "@hooks";
import { FaPlus } from "react-icons/fa";

import ScrollableFeed from "react-scrollable-feed";
import CreateChannelModal from "./CreateChannelModal";
import ChannelTextListItem from "./ChannelTextListItem";

import { Item, Menu, useContextMenu } from "react-contexify";
import Stack from "@mui/material/Stack";
import { useQuery } from "@apollo/client";
import {
    GetChannels,
    OnChannelCreated,
    OnChannelDeleted,
} from "@/gql/channels";

const ServerSidebarChannels = ({ server }: { server: Server }) => {
    const { user } = useAuth();
    const [visible, setVisible] = useState(false);

    const { subscribeToMore, data: { getChannels: channels = [] } = {} } =
        useQuery(GetChannels, {
            variables: {
                serverId: server.id,
                type: ["text"],
            },
        });

    const { show } = useContextMenu();

    useEffect(() => {
        const unsubcribe = subscribeToMore({
            document: OnChannelCreated,
            variables: { serverId: server.id },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const newChannel = subscriptionData.data.channelCreated;
                return {
                    getChannels: [...prev.getChannels, newChannel],
                };
            },
        });

        return () => unsubcribe();
    }, []);

    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: OnChannelDeleted,
            variables: { serverId: server.id },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const deletedChannel = subscriptionData.data.channelDeleted;
                return {
                    getChannels: prev.getChannels.filter(
                        (channel: Channel) => channel.id !== deletedChannel.id
                    ),
                };
            },
        });

        return () => unsubscribe();
    }, []);

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
                    {channels.map((channel: Channel) => (
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
