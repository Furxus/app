import { useAuth } from "@/hooks";
import UserAvatar from "@/shared/components/avatar/UserAvatar.component";

import { DMChannel } from "@furxus/types";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

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
            className={classNames("p-1 rounded-lg w-full ", {
                "bg-neutral-700": isActive,
                "cursor-pointer hover:bg-neutral-700": !isActive,
            })}
        >
            <UserAvatar
                user={recipient}
                withBadge
                button={{
                    btnProps: {
                        sx: {
                            width: 40,
                            height: 40,
                        },
                    },
                }}
            />
            <Stack direction="column">
                <Typography variant="caption" className="truncate">
                    {recipient?.displayName ?? recipient?.username}
                </Typography>
            </Stack>
        </Stack>
    );
};

export default DMChannelItem;
