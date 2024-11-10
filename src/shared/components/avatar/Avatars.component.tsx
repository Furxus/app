import classNames from "classnames";
import { Dispatch, SetStateAction, useState } from "react";
import capitalize from "lodash/capitalize";
import { useAppMode, useAuth } from "@/hooks";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import { Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";

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

const Avatars = ({
    setMainOpen,
}: {
    setMainOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    const { user } = useAuth();
    const { appMode } = useAppMode();

    const [open, setOpen] = useState(false);
    const [currentAvatar, setCurrentAvatar] = useState<string>("");
    const [previousMode, setPreviousMode] = useState(false);
    const [indexSelected, setIndexSelected] = useState<number>(0);

    const { mutate: updateAvatar, isPending } = useMutation({
        mutationKey: ["updateAvatar"],
        mutationFn: (avatar: any) => api.patch("/@me", { avatar }),
        onSuccess: () => {
            setOpen(false);
            setMainOpen(false);
            setCurrentAvatar("");
        },
    });

    const onClose = () => {
        setOpen(false);
        setCurrentAvatar("");
        setPreviousMode(false);
    };

    const togglePreviousMode = () => {
        setPreviousMode(!previousMode);
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
                    <Stack direction="column" gap={0.5} alignItems="center">
                        {previousMode ? (
                            <>
                                <Typography variant="h6">
                                    Previous Avatars
                                </Typography>
                                <Stack direction="row">
                                    {user.previousAvatars.map(
                                        (avatar: string, index: number) => (
                                            <Stack
                                                key={index}
                                                className="p-4"
                                                justifyContent="center"
                                                alignItems="center"
                                                gap={0.5}
                                                onClick={() => {
                                                    setCurrentAvatar(avatar);
                                                    setIndexSelected(index);
                                                }}
                                            >
                                                <img
                                                    className={classNames(
                                                        "rounded-full cursor-pointer w-[72px] h-[72px]",
                                                        {
                                                            "border-[3px]":
                                                                currentAvatar ===
                                                                avatar,
                                                        }
                                                    )}
                                                    src={avatar}
                                                    alt={avatar}
                                                />
                                            </Stack>
                                        )
                                    )}
                                </Stack>
                            </>
                        ) : (
                            <>
                                <Typography variant="h6">
                                    Default Avatars
                                </Typography>
                                <Stack direction="row">
                                    {species.map((species, index) => (
                                        <Stack
                                            key={index}
                                            className="p-4"
                                            justifyContent="center"
                                            alignItems="center"
                                            gap={0.5}
                                            onClick={() =>
                                                setCurrentAvatar(species)
                                            }
                                        >
                                            <img
                                                className={classNames(
                                                    "rounded-full cursor-pointer w-[72px] h-[72px]",
                                                    {
                                                        "border-[3px]":
                                                            currentAvatar ===
                                                            species,
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
                            </>
                        )}
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        className="pr-4"
                        gap={0.5}
                    >
                        <Stack direction="row" gap={1} alignItems="center">
                            <span className="text-sm font-semibold">
                                {currentAvatar
                                    ? `Selected: ${
                                          previousMode
                                              ? indexSelected + 1
                                              : capitalize(currentAvatar)
                                      }`
                                    : "Select an avatar"}
                            </span>
                            <Button
                                size="small"
                                variant="outlined"
                                color={
                                    appMode === "servers"
                                        ? "success"
                                        : "primary"
                                }
                                onClick={() => togglePreviousMode()}
                            >
                                {previousMode
                                    ? "Default Avatars"
                                    : "Previous Avatars"}
                            </Button>
                        </Stack>
                        <Stack direction="row" gap={0.5}>
                            <Button
                                color="success"
                                size="small"
                                variant="contained"
                                disabled={isPending || !currentAvatar}
                                onClick={() => updateAvatar(currentAvatar)}
                            >
                                Save
                            </Button>
                            <Button
                                onClick={onClose}
                                size="small"
                                disabled={isPending}
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

export default Avatars;