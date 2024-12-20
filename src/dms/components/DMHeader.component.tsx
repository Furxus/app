import UserAvatar from "@/shared/components/avatar/UserAvatar.component";
import { User } from "@furxus/types";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const DMHeader = ({ recipient }: { recipient: User }) => {
    return (
        <Stack
            position="relative"
            justifyContent="space-between"
            className="w-full bg-neutral-800[0.6] shadow-2xl"
            p={2}
        >
            <Stack direction="row" alignItems="center" gap={1}>
                <UserAvatar
                    avatar={{
                        avatarProps: {
                            sx: {
                                width: 32,
                                height: 32,
                            },
                        },
                    }}
                    button={{
                        btnProps: {
                            sx: {
                                width: 32,
                                height: 32,
                            },
                        },
                    }}
                    user={recipient}
                    withBadge
                />
                <Typography>
                    {recipient?.displayName ?? recipient?.username}
                </Typography>
            </Stack>
        </Stack>
    );
};

export default DMHeader;
