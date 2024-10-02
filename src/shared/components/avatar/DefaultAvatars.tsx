import classNames from "classnames";
import { useState } from "react";
import capitalize from "lodash/capitalize";
import { UpdateDefaultAvatar } from "@/gql/auth";
import { useMutation } from "@apollo/client";
import { useAppMode, useAuth } from "@/hooks";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";

const species = [
    "cat",
    "dog",
    "dragon",
    "fox",
    "hyena",
    "rabbit",
    "raccoon",
    "wolf",
];

const DefaultAvatars = () => {
    const { refresh } = useAuth();
    const { appMode } = useAppMode();

    const [open, setOpen] = useState(false);
    const [currentAvatar, setCurrentAvatar] = useState<string>("");

    const [updateDefaultAvatar, { loading }] = useMutation(
        UpdateDefaultAvatar,
        {
            variables: {
                avatar: currentAvatar,
            },
            update: () => {
                setOpen(false);
                refresh();
                setCurrentAvatar("");
            },
        }
    );

    const onClose = () => {
        setOpen(false);
        setCurrentAvatar("");
    };

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                size="small"
                variant="outlined"
                color={appMode === "servers" ? "success" : "primary"}
            >
                Avatars
            </Button>
            <Modal
                className="flex justify-center items-center"
                open={open}
                onClose={onClose}
            >
                <Stack
                    direction="column"
                    className={classNames(
                        "bg-neutral-900 border rounded-lg p-4",
                        {
                            "border-green-500/60": appMode === "servers",
                            "border-blue-500/60": appMode === "posts",
                        }
                    )}
                >
                    <Stack direction="row">
                        {species.map((species) => (
                            <Stack
                                key={species}
                                className="p-4"
                                justifyContent="center"
                                alignItems="center"
                                gap={0.5}
                                onClick={() => setCurrentAvatar(species)}
                            >
                                <img
                                    className={classNames(
                                        "rounded-full cursor-pointer w-[72px] h-[72px]",
                                        {
                                            "border-[3px]":
                                                currentAvatar === species,
                                        }
                                    )}
                                    src={`https://cdn.furxus.com/defaultAvatar/${species}.png`}
                                    alt={species}
                                />
                                <span className="text-sm font-semibold">
                                    {capitalize(species)}
                                </span>
                            </Stack>
                        ))}
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        className="pr-4"
                        gap={0.5}
                    >
                        <span className="text-sm font-semibold">
                            {currentAvatar
                                ? `Selected: ${capitalize(currentAvatar)}`
                                : "Select an avatar"}
                        </span>
                        <Stack direction="row" gap={0.5}>
                            <Button
                                color="success"
                                size="small"
                                variant="contained"
                                disabled={loading || !currentAvatar}
                                onClick={() => updateDefaultAvatar()}
                            >
                                Save
                            </Button>
                            <Button
                                onClick={onClose}
                                size="small"
                                disabled={loading}
                                variant="outlined"
                                color="error"
                            >
                                Close
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
            </Modal>
        </>
    );
};

export default DefaultAvatars;
