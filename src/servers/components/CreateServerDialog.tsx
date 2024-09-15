import { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { FaCamera } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import AvatarEditor from "react-avatar-edit";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { CreateServer } from "../../gql/servers";

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
        <Dialog open={visible} onClose={() => closeModal()}>
            <DialogTitle className="flex justify-center">
                Create a server
            </DialogTitle>
            <DialogContent className="flex flex-col gap-4 justify-center items-center">
                <div className="flex flex-col items-center px-10 justify-center gap-4">
                    <div className="flex items-center w-full justify-center">
                        {thumbnail ? (
                            <div className="relative">
                                <MdClose
                                    className="absolute top-0 right-0"
                                    onClick={() => setThumbnail(null)}
                                />
                                <img
                                    className="w-[96px] h-[96px] rounded-full"
                                    src={thumbnail}
                                    alt="thumbnail"
                                />
                            </div>
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
                    </div>
                    <div className="flex flex-col justify-start items-start gap-1">
                        <TextField
                            label="Server Name"
                            error={!!errors.name}
                            name="name"
                            value={fields.name}
                            onChange={onChange}
                            className="mb-4"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") onSubmit();
                            }}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                    <Button
                        onClick={onSubmit}
                        variant="contained"
                        color="success"
                        disabled={loading}
                    >
                        Create
                    </Button>
                    <Button
                        disabled={loading}
                        onClick={() => setModalType("join")}
                        variant="text"
                    >
                        or join a server
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateServerDialog;
