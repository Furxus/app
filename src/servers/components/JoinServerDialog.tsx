import { useMutation } from "@apollo/client";
import { JoinServer } from "@gql/servers";
import { Dispatch, SetStateAction, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, Modal, Stack, Typography } from "@mui/material";

const JoinServerDialog = ({
    visible,
    setVisible,
    setModalType,
}: {
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    setModalType: Dispatch<SetStateAction<"create" | "join">>;
}) => {
    const [code, setCode] = useState<string>("");

    const [error, setError] = useState<string | null>(null);

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
                            disabled={loading || !code}
                        >
                            Join
                        </Button>
                    </Stack>
                    <Stack direction="column" gap={1} alignItems="center">
                        {!loading && (
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
