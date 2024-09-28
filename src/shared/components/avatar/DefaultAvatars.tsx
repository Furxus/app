import { Button, Modal, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import classNames from "classnames";
import { useState } from "react";

const species = ["dog", "dragon", "fox", "hyena", "rabbit", "raccoon", "wolf"];

const DefaultAvatars = () => {
    const [open, setOpen] = useState(false);

    const [currentAvatar, setCurrentAvatar] = useState<string>("");

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                size="small"
                variant="outlined"
            >
                Avatars
            </Button>
            <Modal
                className="flex justify-center items-center"
                open={open}
                onClose={onClose}
            >
                <Grid spacing={2}>
                    {species.map((species) => (
                        <Grid key={species}>
                            <Stack
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
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
            </Modal>
        </>
    );
};

export default DefaultAvatars;
