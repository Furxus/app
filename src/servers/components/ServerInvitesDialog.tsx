import moment from "moment";
import { Server } from "@furxus/types";
import { Dispatch, Fragment, SetStateAction } from "react";
import Stack from "@mui/material/Stack";
import Avatar from "@/shared/components/avatar/Avatar";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { Modal, Tooltip, Typography } from "@mui/material";
import UserAvatar from "@/shared/components/avatar/UserAvatar";

const ServerInvitesDialog = ({
    server,
    visible,
    setVisible,
}: {
    server: Server;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
    return (
        <Modal
            className="flex items-center justify-center"
            open={visible}
            onClose={() => setVisible(false)}
        >
            <Stack
                p={4}
                gap={2}
                direction="column"
                className="bg-neutral-900 border rounded-lg border-green-500/60"
            >
                <Stack direction="row">
                    {server.icon ? (
                        <Avatar
                            server={server}
                            className="mr-2"
                            sx={{ width: 32, height: 32 }}
                        />
                    ) : (
                        <Avatar className="mr-2" sx={{ width: 32, height: 32 }}>
                            <span className="text-xs">
                                {server.nameAcronym}
                            </span>
                        </Avatar>
                    )}
                    <Typography variant="h6" className="text-xl font-semibold">
                        {server.name} Invites
                    </Typography>
                </Stack>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableCell>Invite Code</TableCell>
                        <TableCell>Uses</TableCell>
                        <TableCell>Max Uses</TableCell>
                        <TableCell>Expires</TableCell>
                        <TableCell>Created by</TableCell>
                        <TableCell>Created</TableCell>
                    </TableHead>
                    <TableBody>
                        {server.invites.map((invite, i: number) => (
                            <Fragment key={i}>
                                <TableCell>{invite.code}</TableCell>
                                <TableCell>{invite.uses}</TableCell>
                                <TableCell>{invite.maxUses}</TableCell>
                                <TableCell>
                                    {invite.expiresAt ? (
                                        <Tooltip
                                            disableInteractive
                                            title={
                                                <time
                                                    dateTime={invite.expiresAt}
                                                >
                                                    {moment(
                                                        invite.expiresAt
                                                    ).calendar()}{" "}
                                                    (
                                                    {moment(
                                                        invite.expiresAt
                                                    ).fromNow()}
                                                    )
                                                </time>
                                            }
                                        >
                                            <time dateTime={invite.expiresAt}>
                                                {moment(
                                                    invite.expiresAt
                                                ).fromNow()}
                                            </time>
                                        </Tooltip>
                                    ) : (
                                        "Never"
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" alignItems="center">
                                        <UserAvatar
                                            user={invite.createdBy}
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
                                        />
                                        <span className="font-semibold">
                                            {invite.createdBy?.displayName ??
                                                invite.createdBy?.username}
                                        </span>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Tooltip
                                        disableInteractive
                                        title={
                                            <time dateTime={invite.createdAt}>
                                                {moment(
                                                    invite.createdAt
                                                ).calendar()}{" "}
                                                (
                                                {moment(
                                                    invite.createdAt
                                                ).fromNow()}
                                                )
                                            </time>
                                        }
                                    >
                                        <time dateTime={invite.createdAt}>
                                            {moment(invite.createdAt).fromNow()}
                                        </time>
                                    </Tooltip>
                                </TableCell>
                            </Fragment>
                        ))}
                    </TableBody>
                </Table>
            </Stack>
        </Modal>
    );
};

export default ServerInvitesDialog;
