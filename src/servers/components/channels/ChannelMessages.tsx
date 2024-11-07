import { useRef } from "react";
import MessageItem from "../../../shared/components/messages/MessageItem";
import { MessageSkeleton } from "@utils";
import { Message } from "@furxus/types";
import Stack from "@mui/material/Stack";

import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

import classNames from "classnames";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";

const ChannelMessages = ({ channelId }: { channelId: string }) => {
    const scrollRef = useRef<VirtuosoHandle>(null);

    const { isLoading, data: messages } = useQuery({
        queryKey: ["getMessages", { channelId }],
        queryFn: () =>
            api
                .get(`/channels/${channelId}/messages?limit=50`)
                .then((res) => res.data),
    });

    /*const {
        fetchMore,
        isisLoading,
        subscribeToMore,
        data: { getMessages: messages = [] } = {},
    } = useQuery(GetMessages, {
        variables: {
            channelId,
            limit: 50,
        },
    });

    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: OnMessageCreated,
            variables: {
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
    }, []);*/

    const EmptyMessage = () => (
        <Stack justifyContent="center" alignItems="center">
            <span className="text-xl">No messages</span>
            <span className="text-neutral-400">
                Be the first to send a message!
            </span>
        </Stack>
    );

    /* const next = () => {
        fetchMore({
            variables: {
                channelId,
                limit: 25,
                cursor: messages[0].createdTimestamp.toString(),
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                if (fetchMoreResult.getMessages.length === 0) return prev;

                return {
                    getMessages: [
                        ...fetchMoreResult.getMessages,
                        ...prev.getMessages,
                    ],
                };
            },
        });
    };*/

    return (
        <Stack
            pl={2}
            className={classNames("flex-grow", {
                "justify-center": messages?.length === 0,
            })}
            id="messages"
        >
            {isLoading ? (
                <MessageSkeleton />
            ) : messages?.length === 0 ? (
                <EmptyMessage />
            ) : (
                <Virtuoso
                    ref={scrollRef}
                    data={messages}
                    initialTopMostItemIndex={messages?.length - 1}
                    atTopStateChange={(atTop) => {
                        if (atTop) {
                            //next();
                        }
                    }}
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
