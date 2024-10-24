import { useMutation } from "@apollo/client";
import { CreateChannel } from "@gql/channels";
import { Dispatch, SetStateAction, useState } from "react";
import { FaHashtag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Modal, Typography } from "@mui/material";

const CreateChannelModal = ({
    serverId,
    visible,
    setVisible,
}: {
    serverId: string;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
    const navigate = useNavigate();

    const [fields, setFields] = useState({ name: "", type: "text" });

    const [errors, setErrors] = useState({ name: null, type: null });

    const [createChannel, { loading }] = useMutation(CreateChannel, {
        variables: {
            serverId,
            name: fields.name,
            type: "text",
        },
        onCompleted: ({ createChannel: channel }) => {
            if (channel.type === "text") {
                navigate(`/servers/${serverId}/${channel.id}`);
            }
            closeModal();
        },
    });

    const closeModal = () => {
        setVisible(false);
        setTimeout(() => {
            setFields({ name: "", type: "text" });
            setErrors({ name: null, type: null });
        }, 1000);
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
                <Typography variant="h6">Create a channel</Typography>
                <Stack direction="column" gap={2} alignItems="center">
                    <Stack direction="column" gap={1}>
                        <TextField
                            color="success"
                            onChange={(e) =>
                                setFields((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            name="name"
                            label="Channel Name"
                            value={fields.name}
                            error={!!errors.name}
                            helperText={errors.name}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <FaHashtag className="text-gray-500 mr-2" />
                                    ),
                                },
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && fields.name)
                                    createChannel();
                            }}
                        />
                        <Button
                            color="success"
                            onClick={() => {
                                createChannel();
                            }}
                            variant="contained"
                            disabled={loading || !fields.name}
                        >
                            Create Channel
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Modal>
    );

    /*return (
        <Dialog open={visible} onClose={closeModal}>
            <DialogTitle className="flex gap-2 items-center justify-center">
                <h2 className="text-lg font-semibold">Create a channel</h2>
            </DialogTitle>
            <DialogContent>
                <Stack p={4} direction="column" gap={2}>
                    <Stack
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        gap={4}
                    >
                        <TextField
                            label="Channel Name"
                            value={fields.name}
                            onChange={(e) =>
                                setFields((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            error={!!errors.name}
                            helperText={errors.name}
                            className="w-full"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <FaHashtag className="text-gray-500 mr-2" />
                                    ),
                                },
                            }}
                        />
                    </Stack>
                    <Stack justifyContent="flex-end" gap={4}>
                        <Button
                            color="success"
                            onClick={() => {
                                createChannel();
                            }}
                            variant="contained"
                            disabled={loading}
                        >
                            Create Channel
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );*/
};

export default CreateChannelModal;
