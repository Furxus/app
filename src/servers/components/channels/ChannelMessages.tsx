import { useRef } from "react";
import MessageItem from "../../../shared/components/messages/MessageItem";
import { MessageSkeleton } from "@utils";
import { Message } from "@furxus/types";
import Stack from "@mui/material/Stack";

import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

import classNames from "classnames";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/api";

const ChannelMessages = ({ channelId }: { channelId: string }) => {
    const scrollRef = useRef<VirtuosoHandle>(null);

    const { isFetching, data: messages = [] } = useQuery({
        queryKey: ["getMessages", { channelId }],
        queryFn: () =>
            api.get(`/channels/${channelId}/messages`).then((res) => res.data),
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
