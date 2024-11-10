import { useRef } from "react";
import MessageItem from "../../../shared/components/messages/MessageItem.component";
import { MessageSkeleton } from "@utils";
import { Message } from "@furxus/types";
import Stack from "@mui/material/Stack";

import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

import classNames from "classnames";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/api";

const ChannelMessages = ({ channelId }: { channelId: string }) => {
    const scrollRef = useRef<VirtuosoHandle>(null);

    const { isFetching, fetchNextPage, hasNextPage, data } = useInfiniteQuery<
        Message[]
    >({
        queryKey: ["getMessages", { channelId }],
        queryFn: ({ pageParam }) =>
            api
                .get(
                    `/channels/${channelId}/messages?limit=50${
                        pageParam ? `&cursor=${pageParam}` : ""
                    }`
                )
                .then((res) => res.data),
        initialPageParam: null,
        getNextPageParam: (lastMessage) => {
            if (lastMessage.length === 0) return null;
            return lastMessage[0].createdTimestamp;
        },
        select: (data) => ({
            pages: [...data.pages].reverse(),
            pageParams: [...data.pageParams].reverse(),
        }),
        placeholderData: keepPreviousData,
    });

    const EmptyMessage = () => (
        <Stack justifyContent="center" alignItems="center">
            <span className="text-xl">No messages</span>
            <span className="text-neutral-400">
                Be the first to send a message!
            </span>
        </Stack>
    );

    const messages = data?.pages.flat();

    if (!messages)
        return (
            <Stack flexGrow={1}>
                <MessageSkeleton />
            </Stack>
        );

    return (
        <Stack
            pl={2}
            className={classNames("flex-grow", {
                "justify-center": messages?.length === 0,
            })}
            id="messages"
        >
            {isFetching && !messages.length ? (
                <MessageSkeleton />
            ) : messages?.length === 0 ? (
                <EmptyMessage />
            ) : (
                <Virtuoso
                    ref={scrollRef}
                    data={messages}
                    initialTopMostItemIndex={messages?.length - 1}
                    atTopStateChange={(isAtTop) => {
                        if (!isFetching && hasNextPage && isAtTop)
                            fetchNextPage();
                    }}
                    itemContent={(i, message: Message) => (
                        <MessageItem
                            key={i}
                            message={message}
                            index={i}
                            messages={messages}
                        />
                    )}
                    followOutput={true}
                />
            )}
        </Stack>
    );
};

export default ChannelMessages;
