import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction, useState } from "react";

import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import { Server } from "@furxus/types";
import { Modal, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";

const ConfirmServerDeleteDialog = ({
    server,
    visible,
    setVisible,
}: {
    server: Server;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [confirm, setConfirm] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const { mutate: deleteServer, isPending } = useMutation({
        mutationKey: ["deleteServer"],
        mutationFn: () => api.delete(`/servers/${server.id}`),
        onSuccess: () => {
            navigate("/servers");
            queryClient.invalidateQueries({ queryKey: ["getUserServers"] });
            closeModal();
        },
        onError: (err: any) => {
            const errors = err.response.data.errors as any[];
            errors?.forEach((error) => {
                setError(error.message);
            });
        },
    });

    // const [deleteServer, { loading }] = useMutation(DeleteServer, {
    //     variables: { id: server.id },
    //     onCompleted: () => {
    //         navigate("/servers");
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
        setError(null);
        setConfirm("");
        setVisible(false);
    };

    const deleteFunc = () => {
        if (confirm === "CONFIRM") {
            deleteServer();
            return;
        }

        setError("Confirmation text is incorrect");
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
                className="bg-neutral-900 border rounded-lg w-1/4 border-red-500/60"
            >
                <Typography variant="body2" className="font-bold">
                    Are you sure you want to delete this server?
                </Typography>
                <Stack direction="column" alignItems="center" gap={2}>
                    <TextField
                        color="error"
                        onChange={(e) => setConfirm(e.target.value)}
                        name="confirm"
                        label="Type CONFIRM to confirm"
                        value={confirm}
                        error={error !== null}
                        helperText={error}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") deleteFunc();
                        }}
                    />
                    <Typography
                        variant="body2"
                        className="font-semibold text-red-500"
                    >
                        This action is irreversible
                    </Typography>
                </Stack>
                <Stack direction="row" gap={1}>
                    <Button
                        variant="contained"
                        onClick={() => deleteFunc()}
                        color="error"
                        disabled={confirm !== "CONFIRM" || isPending}
                    >
                        Confirm
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => closeModal()}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                </Stack>
            </Stack>
        </Modal>
    );

    /*return (
        <Dialog open={visible} onClose={() => closeModal()}>
            <DialogTitle className="flex justify-center text-lg">
                Are you sure you want to delete this server?
            </DialogTitle>
            <DialogContent className="flex justify-center flex-col gap-2 items-center">
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    gap={2}
                >
                    <TextField
                        onChange={(e) => setConfirm(e.target.value)}
                        name="confirm"
                        value={confirm}
                        error={error !== null}
                        helperText={error}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") deleteFunc();
                        }}
                    />
                    <span className="font-semibold text-sm">
                        Type CONFIRM (all uppercase) to confirm the deletion
                    </span>
                    <span className="font-semibold text-sm text-red-500">
                        This action is irreversible
                    </span>
                </Stack>
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    gap={1}
                >
                    <Button
                        onClick={() => {
                            deleteFunc();
                        }}
                        color="error"
                        variant="contained"
                        disabled={confirm !== "CONFIRM" || loading}
                    >
                        Confirm
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => closeModal()}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );*/
};

export default ConfirmServerDeleteDialog;
