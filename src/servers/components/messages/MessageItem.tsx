import moment from "moment";

import { Message } from "@furxus/types";
import { Item, Menu, useContextMenu } from "react-contexify";
import { FaCopy, FaEdit, FaTrash } from "react-icons/fa";

import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { useMutation } from "@apollo/client";
import { DeleteMessage, EditMessage } from "@gql/messages";
import { useAuth } from "@hooks";

import copy from "copy-to-clipboard";
import markdownToTxt from "markdown-to-txt";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useSyntaxHighlighterTheme } from "@utils";

// Markdown imports
import Markdown from "react-markdown";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypePrism from "rehype-prism-plus/all";
import rehypeRaw from "rehype-raw";
import remarkParse from "remark-parse";
import { rehypeTwemoji, RehypeTwemojiOptions } from "rehype-twemoji";

import MessageEmbed from "./MessageEmbed";
import { KeyboardEvent, useState } from "react";
import { TextField, Tooltip } from "@mui/material";

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
    const mdTheme = useSyntaxHighlighterTheme();
    const [messageEditing, setMessageEditing] = useState(false);
    const [newContent, setNewContent] = useState(message.content);

    // "m" implies it is a mutation function
    const [mEditMessage] = useMutation(EditMessage, {
        variables: {
            serverId: message.server.id,
            channelId: message.channel.id,
            id: message.id,
            content: newContent,
        },
    });

    const [deleteMessage] = useMutation(DeleteMessage, {
        variables: {
            serverId: message.server.id,
            channelId: message.channel.id,
            id: message.id,
        },
    });

    if (!message) return <></>;

    const editMessage = () => {
        if (newContent.trim() === "") {
            deleteMessage();
            setMessageEditing(false);
            return;
        } else if (newContent === message.content) {
            setMessageEditing(false);
            return;
        }
        mEditMessage();
        setMessageEditing(false);
    };

    const showMenu = (event: any) => {
        event.stopPropagation();
        show({
            id: `message-menu-${message.id}`,
            event,
        });
    };

    const {
        member: { user },
        content,
        createdAt,
        updatedAt,
    } = message;

    const sameUser = (i: number, message: Message) =>
        messages[i - 1]?.member.user.id !== message.member.user.id;

    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            editMessage();
        }

        if (e.key === "Escape") {
            setMessageEditing(false);
        }
    };

    const renderMessage = () => (
        <Stack direction="column">
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
                        rehypeRaw,
                        [
                            rehypeTwemoji,
                            {
                                format: "svg",
                            } satisfies RehypeTwemojiOptions,
                        ],
                        rehypePrism,
                    ]}
                    components={{
                        code({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                        }: any) {
                            const match = /language-(\w+)/.exec(
                                className || ""
                            );
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    style={mdTheme}
                                    PreTag="div"
                                    language={match[1]}
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
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
                        <Typography className="text-[10px] text-neutral-400">
                            (edited)
                        </Typography>
                    </Tooltip>
                )}
            </Stack>
            <Stack pb={1}>
                {message.embeds.length > 0 &&
                    message.embeds.map((embed, i) => (
                        <MessageEmbed embed={embed} key={i} />
                    ))}
            </Stack>
        </Stack>
    );

    return (
        <>
            {sameUser(index, message) ? (
                <Stack
                    className="w-full hover:bg-neutral-700/60 p-2"
                    direction="row"
                    gap={1}
                    mt={3}
                >
                    <Avatar src={user.avatar ?? user.defaultAvatar} />
                    <Stack className="w-full">
                        <Stack gap={1} direction="row" alignItems="center">
                            <span className="font-bold">
                                {user.displayName ?? user.username}
                            </span>
                            <time
                                className="text-gray-500 text-xs"
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
                                            message.content.length,
                                            message.content.length
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
                    className="w-full hover:bg-neutral-700/60 py-1"
                    pl={7}
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
                                        message.content.length,
                                        message.content.length
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
                                ● empty message to delete
                            </Typography>
                        </Stack>
                    ) : (
                        renderMessage()
                    )}
                </Stack>
            )}

            <Menu id={`message-menu-${message.id}`}>
                {auth.id === user.id && (
                    <Item onClick={() => setMessageEditing(true)}>
                        <FaEdit className="mr-2" />
                        Edit Message
                    </Item>
                )}
                <Item onClick={() => copy(markdownToTxt(content))}>
                    <FaCopy className="mr-2" />
                    Copy Raw Text
                </Item>
                <Item onClick={() => copy(content)}>
                    <FaCopy className="mr-2" />
                    Copy Text
                </Item>
                {auth.id === user.id && (
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
