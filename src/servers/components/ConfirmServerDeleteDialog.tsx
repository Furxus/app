import { useMutation } from "@apollo/client";
import { DeleteServer } from "../../gql/servers";
import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction, useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import { Server } from "@furxus/types";

const ConfirmServerDeleteDialog = ({
    server,
    visible,
    setVisible,
}: {
    server: Server;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
    const navigate = useNavigate();

    const [confirm, setConfirm] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const [deleteServer, { loading }] = useMutation(DeleteServer, {
        variables: { id: server.id },
        onCompleted: () => {
            navigate("/servers");
        },
        onError: (error) => {
            const errs = error.graphQLErrors[0].extensions?.errors as any[];
            if (!errs) return;
            errs.forEach((err) => {
                setError(err.message);
            });
        },
    });

    const closeModal = () => {
        setError(null);
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
                <Stack justifyContent="center" alignItems="center" gap={1}>
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
    );
};

export default ConfirmServerDeleteDialog;
