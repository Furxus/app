import { useAuth } from "@/hooks";
import UserAvatar from "@/shared/components/avatar/UserAvatar";
import { DMChannel } from "@furxus/types";
import { Stack, Typography } from "@mui/material";
import classNames from "classnames";
import { useLocation, useNavigate } from "react-router-dom";

const DMChannelItem = ({ channel }: { channel: DMChannel }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user: auth } = useAuth();

    const isActive = pathname.includes(channel.id);

    const recipient =
        channel.recipient1?.id === auth.id
            ? channel.recipient2
            : channel.recipient1;

    return (
        <Stack
            direction="row"
            gap={1}
            alignItems="center"
            justifyContent="flex-start"
            onClick={() => {
                if (!isActive) navigate(`/dms/${channel.id}`);
            }}
            className={classNames("px-6 py-1 rounded-lg w-full ", {
                "bg-neutral-700": isActive,
                "cursor-pointer hover:bg-neutral-700": !isActive,
            })}
        >
            <UserAvatar
                button={{
                    btnClasses: "rounded-full",
                    btnProps: {
                        sx: {
                            width: 32,
                            height: 32,
                        },
                    },
                }}
                avatar={{
                    avatarClasses: "rounded-full",
                    avatarProps: {
                        sx: {
                            width: 32,
                            height: 32,
                        },
                    },
                }}
                user={recipient}
            />
            <Stack direction="column">
                <Typography variant="caption" className="truncate">
                    {recipient?.displayName ?? recipient?.username}
                </Typography>
                {channel.messages && channel.messages.length > 0 ? (
                    channel.messages[channel.messages.length - 1] && (
                        <Typography
                            variant="caption"
                            className="text-neutral-400 truncate"
                        >
                            {
                                channel.messages[channel.messages.length - 1]
                                    .content
                            }
                        </Typography>
                    )
                ) : (
                    <Typography
                        variant="caption"
                        className="text-gray-500 truncate"
                    >
                        No messages
                    </Typography>
                )}
            </Stack>
        </Stack>
    );
};

export default DMChannelItem;
