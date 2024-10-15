import { useQuery } from "@apollo/client";
import {
    GetMessages,
    OnMessageCreated,
    OnMessageDeleted,
    OnMessageEdited,
} from "@gql/messages";
import { useEffect, useRef } from "react";
import MessageItem from "../messages/MessageItem";
import { MessageSkeleton } from "@utils";
import { Message } from "@furxus/types";
import Stack from "@mui/material/Stack";

import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

import classNames from "classnames";

const ChannelMessages = ({
    serverId,
    channelId,
}: {
    serverId: string;
    channelId: string;
}) => {
    const scrollRef = useRef<VirtuosoHandle>(null);

    const {
        loading,
        subscribeToMore,
        data: { getMessages: messages = [] } = {},
    } = useQuery(GetMessages, {
        variables: {
            serverId,
            channelId,
        },
    });

    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: OnMessageCreated,
            variables: {
                serverId,
                channelId,
            },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const newMessage: Message =
                    subscriptionData.data.messageCreated;
                if (!newMessage) return prev;

                setTimeout(() => {
                    scrollRef.current?.scrollToIndex({
                        index: "LAST",
                        behavior: "smooth",
                    });
                }, 500);

                return {
                    getMessages: [...prev.getMessages, newMessage],
                };
            },
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: OnMessageEdited,
            variables: {
                serverId,
                channelId,
            },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const editedMessage: Message =
                    subscriptionData.data.messageEdited;
                if (!editedMessage) return prev;

                return {
                    getMessages: prev.getMessages.map((m: Message) =>
                        m.id === editedMessage.id ? editedMessage : m
                    ),
                };
            },
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: OnMessageDeleted,
            variables: {
                serverId,
                channelId,
            },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const deletedMessage: Message =
                    subscriptionData.data.messageDeleted;
                if (!deletedMessage) return prev;

                return {
                    getMessages: prev.getMessages.filter(
                        (m: Message) => m.id !== deletedMessage.id
                    ),
                };
            },
        });

        return () => unsubscribe();
    }, []);

    const EmptyMessage = () => (
        <Stack justifyContent="center" alignItems="center">
            <span className="text-xl">No messages</span>
            <span className="text-neutral-400">
                Be the first to send a message!
            </span>
        </Stack>
    );

    return (
        <Stack
            pl={2}
            className={classNames("flex-grow", {
                "justify-center": messages.length === 0,
            })}
            id="messages"
        >
            {loading ? (
                <MessageSkeleton />
            ) : messages.length === 0 ? (
                <EmptyMessage />
            ) : (
                <Virtuoso
                    ref={scrollRef}
                    data={messages}
                    initialTopMostItemIndex={messages.length - 1}
                    itemContent={(i, message: Message) => (
                        <MessageItem
                            key={i}
                            message={message}
                            index={i}
                            messages={messages}
                        />
                    )}
                />
            )}
        </Stack>
    );
};

export default ChannelMessages;
