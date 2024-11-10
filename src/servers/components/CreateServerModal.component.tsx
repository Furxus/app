import { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaCamera } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import AvatarEditor from "react-avatar-edit";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Avatar from "@/shared/components/avatar/Avatar.component";
import Link from "@mui/material/Link";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { Server } from "@furxus/types";

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
    const queryClient = useQueryClient();

    const [fields, setFields] = useState<Record<string, string>>({
        name: "",
    });

    const [file, setFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<string | null>(null);

    const [errors, setErrors] = useState<Record<string, string | null>>({
        name: null,
        file: null,
    });

    const { mutate, isPending } = useMutation({
        mutationKey: ["createServer"],
        mutationFn: (values: any) =>
            api
                .put("/servers", values, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => res.data),
        onSuccess: (server: Server) => {
            setErrors({
                name: null,
                file: null,
            });

            if (!server) return;

            if (server.channels && server.channels.length > 0)
                navigate(`/servers/${server.id}/${server.channels[0]}`);

            queryClient.invalidateQueries({ queryKey: ["getUserServers"] });

            closeModal();
        },
        onError: (err: any) => {
            const errors = err.response.data.errors as any[];
            errors.forEach((err) => {
                setErrors((prev) => ({
                    ...prev,
                    [err.type]: err.message,
                }));
            });
        },
    });

    // const [createServer, { loading }] = useMutation(CreateServer, {
    //     onCompleted: ({ createServer: serverData }) => {
    //         setErrors({
    //             name: null,
    //             file: null,
    //         });

    //         if (!serverData) return;

    //         if (serverData.channels && serverData.channels.length > 0)
    //             navigate(
    //                 `/servers/${serverData.id}/${serverData.channels[0]?.id}`
    //             );

    //         closeModal();
    //     },
    //     onError: (error) => {
    //         const errs = error.graphQLErrors[0]?.extensions?.errors as any[];
    //         if (!errs) return;
    //         errs.forEach((err) => {
    //             setErrors((prev) => ({
    //                 ...prev,
    //                 [err.type]: err.message,
    //             }));
    //         });
    //     },
    // });

    const closeModal = () => {
        setVisible(false);
        setTimeout(() => {
            setFields({ name: "" });
            setErrors({ name: null, file: null });
            setFile(null);
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
        mutate({
            name: fields.name,
            icon: file,
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
                        disabled={isPending || !!errors.name || !fields.name}
                    >
                        Create
                    </Button>
                </Stack>
                {!isPending && (
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
