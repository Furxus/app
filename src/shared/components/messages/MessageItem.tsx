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
import { KeyboardEvent, useRef, useState } from "react";
import { TextField, Tooltip } from "@mui/material";
import UserAvatar from "@/shared/components/avatar/UserAvatar";

import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";

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
    const [newContent, setNewContent] = useState(message.content);
    const hoverRef = useRef<HTMLDivElement>(null);
    const messageHovered = useHover(hoverRef);

    const { mutate: deleteMessage } = useMutation({
        mutationKey: ["deleteMessage"],
        mutationFn: () =>
            api.delete(
                `/channels/${message.channel?.id}/messages/${message.id}`
            ),
    });

    const { mutate: mEditMessage } = useMutation({
        mutationKey: ["editMessage"],
        mutationFn: (content: string) =>
            api.patch(
                `/channels/${message.channel?.id}/messages/${message.id}`,
                {
                    content,
                }
            ),
    });

    // // "m" implies it is a mutation function
    // const [mEditMessage] = useMutation(EditMessage, {
    //     variables: {
    //         channelId: message.channel?.id,
    //         id: message.id,
    //         content: newContent,
    //     },
    // });

    // const [deleteMessage] = useMutation(DeleteMessage, {
    //     variables: {
    //         channelId: message.channel?.id,
    //         id: message.id,
    //     },
    // });

    if (!message) return <></>;

    const editMessage = () => {
        if (newContent?.trim() === "") {
            deleteMessage();
            setMessageEditing(false);
            return;
        } else if (newContent === message.content) {
            setMessageEditing(false);
            return;
        }
        mEditMessage(newContent);
        setMessageEditing(false);
    };

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

    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            editMessage();
        }

        if (e.key === "Escape") setMessageEditing(false);
    };

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
                <Typography className="bg-neutral-700/40 mt-1 rounded-lg text-neutral-400 text-center shadow-2xl">
                    {moment(createdAt).format("dddd, MMMM Do YYYY")}
                </Typography>
            )}
            {showAvatarAndName ? (
                <Stack
                    className="w-full hover:bg-neutral-700/60 px-2"
                    direction="row"
                    alignItems="center"
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
                                <TextField
                                    className="w-full"
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            borderRadius: 4,
                                            backgroundColor: "rgb(0 0 0 / 8%)",
                                        },
                                    }}
                                    color="success"
                                    onKeyDown={onKeyDown}
                                    value={newContent}
                                    onChange={(e) =>
                                        setNewContent(e.target.value)
                                    }
                                    multiline
                                    autoFocus
                                    onFocus={(e) =>
                                        e.target.setSelectionRange(
                                            message.content?.length ?? 0,
                                            message.content?.length ?? 0
                                        )
                                    }
                                    autoComplete="off"
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
                    className="w-full hover:bg-neutral-700/60"
                    pl={7}
                    ref={hoverRef}
                >
                    {messageEditing ? (
                        <Stack direction="column">
                            <TextField
                                className="w-full"
                                sx={{
                                    "& .MuiInputBase-root": {
                                        borderRadius: 4,
                                        backgroundColor: "rgb(0 0 0 / 8%)",
                                    },
                                }}
                                color="success"
                                onKeyDown={onKeyDown}
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                multiline
                                autoFocus
                                onFocus={(e) =>
                                    e.target.setSelectionRange(
                                        message.content?.length ?? 0,
                                        message.content?.length ?? 0
                                    )
                                }
                                autoComplete="off"
                            />
                            <Typography variant="subtitle2" className="">
                                escape to{" "}
                                <Link
                                    className="cursor-pointer"
                                    onClick={() => setMessageEditing(false)}
                                >
                                    cancel
                                </Link>{" "}
                                or press enter to{" "}
                                <Link
                                    className="cursor-pointer"
                                    onClick={() => editMessage()}
                                >
                                    save
                                </Link>{" "}
                                ●{" "}
                                <span className="font-semibold">
                                    empty message
                                </span>{" "}
                                to delete
                            </Typography>
                        </Stack>
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
