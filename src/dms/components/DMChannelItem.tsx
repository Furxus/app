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
            justifyContent="center"
            alignItems="center"
            gap={1}
            onClick={() => {
                if (!isActive) navigate(`/dms/${channel.id}`);
            }}
            className={classNames("px-4 w-full flex-grow", {
                "bg-neutral-950": isActive,
                "cursor-pointer": !isActive,
            })}
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
                user={recipient}
            />
            <Stack className="p-1" direction="column" justifyContent="center">
                <Typography variant="caption">
                    {recipient?.displayName ?? recipient?.username}
                </Typography>
                {channel.messages ? (
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
