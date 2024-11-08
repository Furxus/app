import moment from "moment";

import { Message } from "@furxus/types";
import { Item, Menu, useContextMenu } from "react-contexify";
import { FaCopy, FaEdit, FaTrash } from "react-icons/fa";

import Stack from "@mui/material/Stack";
import { useAuth } from "@hooks";

import { useHover } from "usehooks-ts";

import copy from "copy-to-clipboard";
import markdownToTxt from "markdown-to-txt";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

// Markdown imports
import Markdown from "react-markdown";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkParse from "remark-parse";

import { rehypeTwemoji, RehypeTwemojiOptions } from "rehype-twemoji";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import MessageEmbed from "./MessageEmbed";
import { useRef, useState } from "react";
import { Tooltip } from "@mui/material";
import UserAvatar from "@/shared/components/avatar/UserAvatar";

import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import ChannelTextEditInput from "../ChannelTextEditInput";

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
        mutationKey: ["deleteMessage"],
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

    const { author, content, createdAt, updatedAt } = message;

    // Check if the previous message is from the same user and was sent within 5 minutes
    const isSameUser = messages[index - 1]?.author?.id === author?.id;
    const isWithinFiveMinutes =
        moment(createdAt).diff(
            moment(messages[index - 1]?.createdAt),
            "minutes"
        ) <= 5;
    const showAvatarAndName = !isSameUser || !isWithinFiveMinutes;

    // Checks if the current message is from a different day than the previous message
    const isNewDay = !moment(createdAt).isSame(
        moment(messages[index - 1]?.createdAt),
        "day"
    );

    const renderMessage = () => (
        <Stack direction="column" position="relative">
            {messageHovered && (
                <Tooltip
                    disableInteractive
                    title={
                        <time className="text-xs" dateTime={createdAt}>
                            {moment(createdAt).calendar()} (
                            {moment(createdAt).fromNow()})
                        </time>
                    }
                >
                    <time
                        className="absolute left-[-52px] top-[0.31rem] text-neutral-400 text-[10px]"
                        dateTime={createdAt}
                    >
                        {moment(createdAt).format("hh:mm A")}
                    </time>
                </Tooltip>
            )}
            <Stack direction="row" alignItems="flex-end" className="w-full">
                <Markdown
                    skipHtml={true}
                    remarkPlugins={[
                        remarkParse,
                        remarkGfm,
                        remarkBreaks,
                        remarkEmoji,
                    ]}
                    rehypePlugins={[
                        rehypeSanitize,
                        rehypeRaw,
                        [
                            rehypeTwemoji,
                            {
                                format: "svg",
                            } satisfies RehypeTwemojiOptions,
                        ],
                    ]}
                    components={{
                        code({
                            node,
                            className,
                            children,
                            style,
                            ref,
                            ...props
                        }) {
                            const match =
                                /language-(\w+)/.exec(className || "") ?? "";
                            return (
                                <SyntaxHighlighter
                                    style={materialDark}
                                    language={match[1] ?? ""}
                                    PreTag="div"
                                    children={String(children).replace(
                                        /\n$/,
                                        ""
                                    )}
                                    wrapLongLines
                                    showLineNumbers
                                    {...props}
                                />
                            );
                        },
                        h1({ node, className, children, ref, ...props }) {
                            return (
                                <Typography
                                    variant="h3"
                                    children={children}
                                    {...props}
                                />
                            );
                        },
                        h2({ node, className, children, ref, ...props }) {
                            return (
                                <Typography
                                    variant="h4"
                                    children={children}
                                    {...props}
                                />
                            );
                        },
                        h3({ node, className, children, ref, ...props }) {
                            return (
                                <Typography
                                    variant="h5"
                                    children={children}
                                    {...props}
                                />
                            );
                        },
                        h4({ node, className, children, ref, ...props }) {
                            return (
                                <Typography
                                    variant="h6"
                                    children={children}
                                    {...props}
                                />
                            );
                        },
                        h5({ node, className, children, ref, ...props }) {
                            return (
                                <Typography
                                    variant="h6"
                                    children={children}
                                    {...props}
                                />
                            );
                        },
                        h6({ node, className, children, ref, ...props }) {
                            return (
                                <Typography
                                    variant="h6"
                                    children={children}
                                    {...props}
                                />
                            );
                        },
                        p({ node, className, children, ref, ...props }) {
                            return (
                                <Typography children={children} {...props} />
                            );
                        },
                        a({ node, className, children, ref, ...props }) {
                            return (
                                <Link
                                    underline="hover"
                                    children={children}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    {...props}
                                />
                            );
                        },
                        li({ node, className, children, ref, ...props }) {
                            return (
                                <Box
                                    component="li"
                                    children={children}
                                    {...props}
                                />
                            );
                        },
                        hr({ node, className, children, ref, ...props }) {
                            return <Divider {...props} />;
                        },
                        blockquote({
                            node,
                            className,
                            children,
                            ref,
                            ...props
                        }) {
                            return (
                                <blockquote children={children} {...props} />
                            );
                        },
                    }}
                    className="flex flex-col justify-center"
                >
                    {content}
                </Markdown>
                {message.edited && (
                    <Tooltip
                        disableInteractive
                        title={
                            <time className="text-xs" dateTime={updatedAt}>
                                {moment(updatedAt).calendar()} (
                                {moment(updatedAt).fromNow()})
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
                                src={embed.media}
                                width={400}
                                height={80}
                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
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
                    {moment(createdAt).format("dddd, MMMM Do YYYY")}
                </Divider>
            )}
            {showAvatarAndName ? (
                <Stack
                    className="w-full hover:bg-neutral-700/60 px-3 py-0.5"
                    direction="row"
                    justifyContent="center"
                    gap={1}
                    mt={3}
                >
                    <UserAvatar
                        button={{
                            btnClasses: "rounded-full",
                            btnProps: {
                                sx: {
                                    width: 40,
                                    height: 40,
                                },
                            },
                        }}
                        user={author}
                    />
                    <Stack className="w-full">
                        <Stack gap={1} direction="row" alignItems="center">
                            <Typography className="font-bold">
                                {author?.displayName ?? author?.username}
                            </Typography>
                            <time
                                className="text-gray-400 text-xs"
                                dateTime={createdAt}
                            >
                                {moment(createdAt).calendar()} (
                                {moment(createdAt).fromNow()})
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
                {auth.id === author?.id && (
                    <Item onClick={() => setMessageEditing(true)}>
                        <FaEdit className="mr-2" />
                        Edit Message
                    </Item>
                )}
                <Item onClick={() => copy(markdownToTxt(content ?? ""))}>
                    <FaCopy className="mr-2" />
                    Copy Raw Text
                </Item>
                <Item onClick={() => copy(content ?? "")}>
                    <FaCopy className="mr-2" />
                    Copy Text
                </Item>
                {auth.id === author?.id && (
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
