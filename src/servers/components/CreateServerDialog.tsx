import { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { FaCamera } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import AvatarEditor from "react-avatar-edit";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { CreateServer } from "@gql/servers";
import { Avatar, Box, Link, Modal, Stack, Typography } from "@mui/material";

const CreateServerDialog = ({
    visible,
    setVisible,
    setModalType,
}: {
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    setModalType: Dispatch<SetStateAction<"create" | "join">>;
}) => {
    const navigate = useNavigate();

    const [fields, setFields] = useState<Record<string, string>>({
        name: "",
    });

    const [file, setFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<string | null>(null);

    const [errors, setErrors] = useState<Record<string, string | null>>({
        name: null,
        file: null,
    });

    const [createServer, { loading }] = useMutation(CreateServer, {
        onCompleted: ({ createServer: serverData }) => {
            setErrors({
                name: null,
                file: null,
            });

            if (!serverData) return;

            if (serverData.channels && serverData.channels.length > 0)
                navigate(
                    `/servers/${serverData.id}/${serverData.channels[0]?.id}`
                );

            closeModal();
        },
        onError: (error) => {
            const errs = error.graphQLErrors[0]?.extensions?.errors as any[];
            if (!errs) return;
            errs.forEach((err) => {
                setErrors((prev) => ({
                    ...prev,
                    [err.type]: err.message,
                }));
            });
        },
    });

    const closeModal = () => {
        setVisible(false);
        setTimeout(() => {
            setFields({ name: "" });
            setErrors({ name: null });
            setThumbnail(null);
        }, 1000);
    };

    const onChange = (e: any) => {
        setFields((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const onUpload = (file: any) => {
        setFile(file);
        setThumbnail(URL.createObjectURL(file));
    };

    const onClose = () => {
        setFile(null);
        setThumbnail("");
    };

    const onSubmit = () => {
        createServer({
            variables: {
                name: fields.name,
                icon: file,
            },
        });
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
                className="bg-neutral-900 border rounded-lg w-1/4 border-green-500/60"
            >
                <Typography variant="h6">Create a server</Typography>
                <Stack direction="column" gap={2} alignItems="center">
                    {thumbnail ? (
                        <Box position="relative">
                            <MdClose
                                className="absolute top-0 right-0 cursor-pointer"
                                onClick={() => onClose()}
                            />
                            <Avatar
                                src={thumbnail}
                                alt="thumbnail"
                                sx={{
                                    width: 96,
                                    height: 96,
                                }}
                            />
                        </Box>
                    ) : (
                        <AvatarEditor
                            width={96}
                            height={96}
                            label={
                                <div className="text-white text-sm flex flex-col items-center">
                                    <FaCamera size="1.5em" />
                                    <span>Upload</span>
                                </div>
                            }
                            onFileLoad={onUpload}
                            onClose={onClose}
                            borderStyle={{
                                border: "dashed 1px #ccc",
                                borderRadius: "50%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            mimeTypes="image/*"
                        />
                    )}
                </Stack>
                <Stack direction="column">
                    <TextField
                        label="Server Name"
                        error={!!errors.name}
                        name="name"
                        value={fields.name}
                        onChange={onChange}
                        className="mb-4"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && fields.name) onSubmit();
                        }}
                    />
                    <Button
                        onClick={onSubmit}
                        variant="contained"
                        color="success"
                        disabled={loading || !!errors.name || !fields.name}
                    >
                        Create
                    </Button>
                </Stack>
                {!loading && (
                    <Link
                        variant="body2"
                        className="cursor-pointer"
                        onClick={() => setModalType("join")}
                    >
                        or join a server
                    </Link>
                )}
            </Stack>
        </Modal>
    );
};

export default CreateServerDialog;
