import { useAppMode, useAuth } from "@/hooks";
import { Button, Modal, Stack, Typography } from "@mui/material";
import classNames from "classnames";
import { ChangeEvent, useRef, useState } from "react";

import CanvasDraw from "react-canvas-draw";
import PopoverPicker from "../PopoverPicker";
import { Colors } from "@/utils";
import { useMutation } from "@apollo/client";
import { UpdateAvatar } from "@/gql/auth";

const AvatarDraw = () => {
    const { appMode } = useAppMode();
    const { refresh } = useAuth();

    const [open, setOpen] = useState(false);
    const [brushColor, setBrushColor] = useState("#000000");
    const [brushSize, setBrushSize] = useState<number | string>(6);

    const [updateAvatar] = useMutation(UpdateAvatar, {
        update: () => {
            setOpen(false);
            canvasRef.current?.clear();
            refresh();
        },
    });

    const canvasRef = useRef<CanvasDraw>(null);

    const changeBrushSize = (e: ChangeEvent<HTMLInputElement>) => {
        if (parseInt(e.target.value) > 0 || e.target.value === "") {
            if (e.target.value === "") {
                setBrushSize("");
                return;
            }
            setBrushSize(parseInt(e.target.value));
        }
    };

    const onUpload = async () => {
        // @ts-ignore: Unreachable code error
        const data = canvasRef.current?.getDataURL("png");
        const blob = data ? await fetch(data).then((res) => res.blob()) : null;
        if (!blob) return;
        updateAvatar({
            variables: {
                avatar: blob,
            },
        });
    };

    const onClose = () => {
        setOpen(false);
        canvasRef.current?.clear();
    };

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                size="small"
                variant="outlined"
            >
                Draw
            </Button>
            <Modal
                className="flex justify-center items-center"
                open={open}
                onClose={onClose}
            >
                <Stack
                    direction="column"
                    gap={2}
                    className={classNames(
                        "bg-neutral-900 border rounded-lg p-4",
                        {
                            "border-green-500/60": appMode === "servers",
                            "border-blue-500/60": appMode === "posts",
                        }
                    )}
                    justifyContent="center"
                    alignItems="center"
                >
                    <CanvasDraw
                        className="rounded-full"
                        ref={canvasRef}
                        brushColor={brushColor}
                        brushRadius={brushSize as number}
                        hideGrid
                    />
                    <Stack
                        direction="row"
                        gap={2}
                        justifyContent="space-between"
                    >
                        <Stack direction="row" gap={1} alignItems="center">
                            <Button
                                color={
                                    appMode === "servers"
                                        ? "success"
                                        : "primary"
                                }
                                onClick={() => canvasRef.current?.clear()}
                                size="small"
                                variant="outlined"
                            >
                                Clear
                            </Button>
                            <Button
                                color={
                                    appMode === "servers"
                                        ? "success"
                                        : "primary"
                                }
                                onClick={() => canvasRef.current?.undo()}
                                size="small"
                                variant="outlined"
                            >
                                Undo
                            </Button>
                        </Stack>
                        <Stack direction="row" gap={1} alignItems="center">
                            <Stack
                                direction="column"
                                gap={0.5}
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Typography variant="body2">
                                    Brush Color
                                </Typography>
                                <PopoverPicker
                                    color={brushColor}
                                    onChange={(color: string) =>
                                        setBrushColor(color)
                                    }
                                />
                            </Stack>
                            <Stack
                                direction="column"
                                gap={0.5}
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Typography variant="body2">
                                    Brush Size
                                </Typography>
                                <input
                                    value={brushSize}
                                    onChange={changeBrushSize}
                                    className="w-20 bg-neutral-700 text-neutral-200 rounded-md pl-1"
                                    color={
                                        appMode === "servers"
                                            ? Colors.servers
                                            : Colors.posts
                                    }
                                    pattern="\d*"
                                />
                            </Stack>
                        </Stack>
                        <Stack direction="row" gap={1} alignItems="center">
                            <Button
                                color={
                                    appMode === "servers"
                                        ? "success"
                                        : "primary"
                                }
                                size="small"
                                variant="outlined"
                                onClick={onUpload}
                            >
                                Upload
                            </Button>
                            <Button
                                color={
                                    appMode === "servers"
                                        ? "success"
                                        : "primary"
                                }
                                onClick={onClose}
                                size="small"
                                variant="outlined"
                            >
                                Cancel
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
            </Modal>
        </>
    );
};

export default AvatarDraw;
