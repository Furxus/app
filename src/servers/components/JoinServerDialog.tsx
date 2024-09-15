import { useMutation } from "@apollo/client";
import { JoinServer } from "../../gql/servers";
import { Dispatch, SetStateAction, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

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

    const [joinServer, { loading }] = useMutation(JoinServer, {
        variables: { code },
        onCompleted: () => {
            closeModal();
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

    return (
        <Dialog open={visible} onClose={() => closeModal()}>
            <DialogTitle className="flex justify-center items-center">
                Join a server
            </DialogTitle>
            <DialogContent className="flex justify-center flex-col gap-2 items-center">
                <div className="flex flex-col justify-center px-10 items-start gap-1">
                    <TextField
                        onChange={(e) => setCode(e.target.value)}
                        name="code"
                        label="Invite Code/Link"
                        className="mb-4"
                        value={code}
                        error={error !== null}
                        helperText={error}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") joinServer();
                        }}
                    />
                </div>
                <div className="flex flex-col justify-center items-center gap-2">
                    <Button
                        variant="contained"
                        onClick={() => joinServer()}
                        color="success"
                        disabled={loading}
                    >
                        Join
                    </Button>
                    <Button
                        variant="text"
                        onClick={() => setModalType("create")}
                        disabled={loading}
                    >
                        or create a server
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default JoinServerDialog;
