import { useState } from "react";

import { BaseServerChannel, Server } from "@furxus/types";
import { useAuth } from "@hooks";
import { FaPlus } from "react-icons/fa";

import { Virtuoso } from "react-virtuoso";

import ChannelTextListItem from "./ChannelTextListItem";

import { Item, Menu, useContextMenu } from "react-contexify";
import Stack from "@mui/material/Stack";
import CreateChannelModal from "./CreateChannelModal";

const ServerSidebarChannels = ({
    server,
    channels,
}: {
    server: Server;
    channels: BaseServerChannel[];
}) => {
    const { user } = useAuth();
    const [visible, setVisible] = useState(false);

    const { show } = useContextMenu();

    // useEffect(() => {
    //     const unsubcribe = subscribeToMore({
    //         document: OnChannelCreated,
    //         variables: { serverId: server.id },
    //         updateQuery: (prev, { subscriptionData }) => {
    //             if (!subscriptionData.data) return prev;
    //             const newChannel = subscriptionData.data.channelCreated;

    //             navigate(`/servers/${server.id}/${newChannel.id}`);

    //             return {
    //                 getChannels: [...prev.getChannels, newChannel],
    //             };
    //         },
    //     });

    //     return () => unsubcribe();
    // }, []);

    // useEffect(() => {
    //     const unsubscribe = subscribeToMore({
    //         document: OnChannelDeleted,
    //         variables: { serverId: server.id },
    //         updateQuery: (prev, { subscriptionData }) => {
    //             if (!subscriptionData.data) return prev;
    //             const deletedChannel = subscriptionData.data.channelDeleted;

    //             navigate(`/servers/${server.id}/${channels[0].id}`);

    //             return {
    //                 getChannels: prev.getChannels.filter(
    //                     (channel: BaseServerChannel) =>
    //                         channel.id !== deletedChannel.id
    //                 ),
    //             };
    //         },
    //     });

    //     return () => unsubscribe();
    // }, []);

    // Keep this for now since they are no permission system created
    const showMenu = (event: any) => {
        event.stopPropagation();
        if (user?.id === server.owner?.id) {
            show({
                id: "sidebar-channels-menu",
                event,
            });
        }
    };

    return (
        <>
            <Stack
                px="0.5rem"
                alignItems="flex-start"
                justifyContent="flex-start"
                onContextMenu={showMenu}
                className="w-full h-full flex-grow pt-14"
            >
                <Virtuoso
                    data={channels}
                    itemContent={(i, channel) => (
                        <ChannelTextListItem
                            key={i}
                            server={server}
                            channel={channel}
                        />
                    )}
                    className="w-full"
                />
            </Stack>
            <Menu id="sidebar-channels-menu">
                {user?.id === server.owner?.id && (
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
