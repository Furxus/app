import { useQuery } from "@apollo/client";
import { GetServerInvites } from "@gql/servers";
import moment from "moment";
import { Server } from "@furxus/types";
import { Dispatch, SetStateAction } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Avatar from "@/shared/components/avatar/Avatar";
import MAvatar from "@mui/material/Avatar";
import DialogContent from "@mui/material/DialogContent";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";

const ServerInvitesDialog = ({
    server,
    visible,
    setVisible,
}: {
    server: Server;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
    const { loading, data: { getServerSettings: { invites } = [] } = [] } =
        useQuery(GetServerInvites, {
            variables: { id: server.id },
        });

    if (loading) return <></>;

    return (
        <Dialog maxWidth="xl" open={visible} onClose={() => setVisible(false)}>
            <DialogTitle>
                <Stack direction="row" alignItems="center">
                    {server.icon ? (
                        <Avatar
                            server={server}
                            className="mr-2"
                            sx={{ width: 32, height: 32 }}
                        />
                    ) : (
                        <MAvatar
                            className="mr-2"
                            sx={{ width: 32, height: 32 }}
                        >
                            <span className="text-xs">
                                {server.nameAcronym}
                            </span>
                        </MAvatar>
                    )}
                    <h2 className="text-xl font-semibold">
                        {server.name} Invites
                    </h2>
                </Stack>
            </DialogTitle>
            <DialogContent>
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
                        {invites.map((invite: any, i: number) => (
                            <>
                                <TableCell key={i}>{invite.code}</TableCell>
                                <TableCell>{invite.uses}</TableCell>
                                <TableCell>{invite.maxUses}</TableCell>
                                <TableCell>
                                    {invite.expiresAt
                                        ? moment(invite.expiresAt).fromNow()
                                        : "Never"}
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center items-center">
                                        <Avatar
                                            src={
                                                invite.createdBy.avatar ??
                                                invite.createdBy.defaultAvatar
                                            }
                                            sx={{ width: 32, height: 32 }}
                                            className="mr-1"
                                        />
                                        <span className="font-semibold">
                                            {invite.createdBy.globalName ??
                                                invite.createdBy.username}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <time dateTime={invite.createdAt}>
                                        {moment(invite.createdAt).fromNow()}
                                    </time>
                                </TableCell>
                            </>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    );
};

export default ServerInvitesDialog;

/**!SECTION
 *     <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Invite Code</Table.Th>
                            <Table.Th>Uses</Table.Th>
                            <Table.Th>Max Uses</Table.Th>
                            <Table.Th>Expires</Table.Th>
                            <Table.Th>Created by</Table.Th>
                            <Table.Th>Created</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {invites.map((invite: any, i: number) => (
                            <Table.Tr key={i}>
                                <Table.Td>{invite.code}</Table.Td>
                                <Table.Td>{invite.uses}</Table.Td>
                                <Table.Td>{invite.maxUses}</Table.Td>
                                <Table.Td>
                                    {invite.expiresAt
                                        ? moment(invite.expiresAt).fromNow()
                                        : "Never"}
                                </Table.Td>
                                <Table.Td>
                                    <div className="flex justify-center items-center">
                                        <Avatar
                                            src={
                                                invite.createdBy.avatar ??
                                                invite.createdBy.defaultAvatar
                                            }
                                            size="sm"
                                            className="mr-1"
                                        />
                                        <span className="font-semibold">
                                            {invite.createdBy.globalName ??
                                                invite.createdBy.username}
                                        </span>
                                    </div>
                                </Table.Td>
                                <Table.Td>
                                    {moment(invite.createdAt).fromNow()}
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
 */
