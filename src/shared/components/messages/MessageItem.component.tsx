import moment from "moment";

import { Message } from "@furxus/types";
import { Item, Menu, useContextMenu } from "react-contexify";
import { FaCopy, FaEdit, FaTrash } from "react-icons/fa";

import Stack from "@mui/material/Stack";
import { useAuth } from "@hooks";

import { useHover } from "usehooks-ts";

import copy from "copy-to-clipboard";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

// Markdown imports

import MessageEmbed from "./MessageEmbed.component";
import { useRef, useState } from "react";
import { Tooltip } from "@mui/material";
import UserAvatar from "@/shared/components/avatar/UserAvatar.component";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import ChannelTextEditInput from "../MessageTextEditInput.component";
import ReadOnlyEditor from "../ReadOnlyEditor.component";
import { generateText } from "@tiptap/react";
import { extensions } from "@/editorExtensions";

const MessageItem = ({
    messages,
    message,
    index,
}: {
    messages: Message[];
    message: Message;
    index: number;
}) => {
    const { show } = useContextMenu();
    const { user: auth } = useAuth();
    const [messageEditing, setMessageEditing] = useState(false);
    const hoverRef = useRef<HTMLDivElement>(null);
    const messageHovered = useHover(hoverRef);

    const { mutate: deleteMessage } = useMutation({
        mutationKey: ["deleteMessage", { messageId: message.id }],
        mutationFn: () =>
            api.delete(
                `/channels/${message.channel.id}/messages/${message.id}`
            ),
    });

    const showMenu = (event: any) => {
        event.stopPropagation();
        show({
            id: `message-menu-${message.id}`,
            event,
        });
    };

    // Check if the previous message is from the same user and was sent within 5 minutes
    const isSameUser = messages[index - 1]?.author?.id === message.author?.id;
    const isWithinFiveMinutes =
        moment(message.createdAt).diff(
            moment(messages[index - 1]?.createdAt),
            "minutes"
        ) <= 5;
    const showAvatarAndName = !isSameUser || !isWithinFiveMinutes;

    // Checks if the current message is from a different day than the previous message
    const isNewDay = !moment(message.createdAt).isSame(
        moment(messages[index - 1]?.createdAt),
        "day"
    );

    const renderMessage = () => (
        <Stack direction="column" position="relative">
            {messageHovered && (
                <Tooltip
                    disableInteractive
                    title={
                        <time className="text-xs" dateTime={message.createdAt}>
                            {moment(message.createdAt).calendar()} (
                            {moment(message.createdAt).fromNow()})
                        </time>
                    }
                >
                    <time
                        className="absolute left-[-52px] top-[0.31rem] text-neutral-400 text-[10px]"
                        dateTime={message.createdAt}
                    >
                        {moment(message.createdAt).format("hh:mm A")}
                    </time>
                </Tooltip>
            )}
            <Stack direction="row" alignItems="flex-end" className="w-full">
                <ReadOnlyEditor content={message.content} />
                {message.edited && (
                    <Tooltip
                        disableInteractive
                        title={
                            <time
                                className="text-xs"
                                dateTime={message.updatedAt}
                            >
                                {moment(message.updatedAt).calendar()} (
                                {moment(message.updatedAt).fromNow()})
                            </time>
                        }
                        placement="top-start"
                    >
                        <Typography className="ml-0.5 text-[10px] text-neutral-400">
                            (edited)
                        </Typography>
                    </Tooltip>
                )}
            </Stack>
            {message.embeds && message.embeds.length > 0 && (
                <Stack pb={1}>
                    {message.embeds.map((embed, i) =>
                        embed.media?.includes("spotify") ? (
                            <iframe
                                key={i}
                                src={embed.media}
                                width={400}
                                height={80}
                            />
                        ) : (
                            <MessageEmbed embed={embed} key={i} />
                        )
                    )}
                </Stack>
            )}
        </Stack>
    );

    return (
        <>
            {isNewDay && (
                <Divider className="mt-1 rounded-lg text-neutral-400 shadow-2xl">
                    {moment(message.createdAt).format("dddd, MMMM Do YYYY")}
                </Divider>
            )}
            {showAvatarAndName ? (
                <Stack
                    className="w-full hover:bg-neutral-700/60 px-3"
                    direction="row"
                    justifyContent="center"
                    gap={1}
                    mt={3}
                >
                    <UserAvatar
                        button={{
                            btnClasses: "rounded-full mt-2",
                            btnProps: {
                                sx: {
                                    width: 40,
                                    height: 40,
                                },
                            },
                        }}
                        user={message.author}
                    />
                    <Stack className="w-full">
                        <Stack gap={1} direction="row" alignItems="center">
                            <Typography className="font-bold">
                                {message.author?.displayName ??
                                    message.author?.username}
                            </Typography>
                            <time
                                className="text-gray-400 text-xs"
                                dateTime={message.createdAt}
                            >
                                {moment(message.createdAt).calendar()} (
                                {moment(message.createdAt).fromNow()})
                            </time>
                        </Stack>
                        <Stack onContextMenu={showMenu} className="w-full">
                            {messageEditing ? (
                                <ChannelTextEditInput
                                    setMessageEditing={setMessageEditing}
                                    deleteMessage={deleteMessage}
                                    message={message}
                                />
                            ) : (
                                renderMessage()
                            )}
                        </Stack>
                    </Stack>
                </Stack>
            ) : (
                <Stack
                    onContextMenu={showMenu}
                    className="w-full hover:bg-neutral-700/60 py-0.5"
                    pl={7.5}
                    ref={hoverRef}
                >
                    {messageEditing ? (
                        <ChannelTextEditInput
                            setMessageEditing={setMessageEditing}
                            deleteMessage={deleteMessage}
                            message={message}
                        />
                    ) : (
                        renderMessage()
                    )}
                </Stack>
            )}
            <Menu id={`message-menu-${message.id}`}>
                {auth.id === message.author?.id && (
                    <Item onClick={() => setMessageEditing(true)}>
                        <FaEdit className="mr-2" />
                        Edit Message
                    </Item>
                )}
                <Item
                    onClick={() =>
                        copy(generateText(message.content, extensions))
                    }
                >
                    <FaCopy className="mr-2" />
                    Copy Text
                </Item>
                {auth.id === message.author?.id && (
                    <Item
                        onClick={() => deleteMessage()}
                        className="text-red-500"
                    >
                        <FaTrash className="mr-2" />
                        Delete Message
                    </Item>
                )}
            </Menu>
        </>
    );
};

export default MessageItem;
