import { Dispatch, SetStateAction, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { Server } from "@furxus/types";
import { useNavigate } from "react-router-dom";

const JoinServerDialog = ({
    visible,
    setVisible,
    setModalType,
}: {
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    setModalType: Dispatch<SetStateAction<"create" | "join">>;
}) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [code, setCode] = useState<string>("");

    const [error, setError] = useState<string | null>(null);

    const { isPending, mutate: joinServer } = useMutation({
        mutationKey: ["joinServer", { code }],
        mutationFn: () =>
            api.post(`/servers`, { code }).then((res) => res.data),
        onSuccess: (server: Server) => {
            if (server.channels && server.channels.length > 0)
                navigate(`/servers/${server.id}/${server.channels[0]?.id}`);

            queryClient.invalidateQueries({ queryKey: ["getUserServers"] });

            closeModal();
        },
        onError: (err: any) => {
            setError(err.response.data.message);
        },
    });

    // const [joinServer, { loading }] = useMutation(JoinServer, {
    //     variables: { code },
    //     onCompleted: () => {
    //         closeModal();
    //     },
    //     onError: (error) => {
    //         const errs = error.graphQLErrors[0].extensions?.errors as any[];
    //         if (!errs) return;
    //         errs.forEach((err) => {
    //             setError(err.message);
    //         });
    //     },
    // });

    const closeModal = () => {
        setCode("");
        setError(null);
        setVisible(false);
    };

    return (
        <Modal
            className="flex items-center justify-center"
            open={visible}
            onClose={() => closeModal()}
        >
            <Stack
                p={4}
                gap={2}
                direction="column"
                alignItems="center"
                className="bg-neutral-900 border rounded-lg w-1/5 border-green-500/60"
            >
                <Typography variant="h6">Join a server</Typography>
                <Stack direction="column" gap={2} alignItems="center">
                    <Stack direction="column" gap={1}>
                        <TextField
                            color="success"
                            onChange={(e) => setCode(e.target.value)}
                            name="code"
                            label="Invite Code/Link"
                            value={code}
                            error={error !== null}
                            helperText={error}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && code) joinServer();
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={() => joinServer()}
                            color="success"
                            disabled={isPending || !code}
                        >
                            Join
                        </Button>
                    </Stack>
                    <Stack direction="column" gap={1} alignItems="center">
                        {!isPending && (
                            <Link
                                variant="body2"
                                className="cursor-pointer"
                                onClick={() => setModalType("create")}
                            >
                                or create a server
                            </Link>
                        )}
                    </Stack>
                </Stack>
            </Stack>
        </Modal>
    );
};

export default JoinServerDialog;
