import classNames from "classnames";
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";

import PopoverPicker from "../PopoverPicker.component";
import { Colors } from "@/utils";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { FaEraser, FaPaintBrush } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import { useAppStore } from "@/hooks/useAppStore";
import { observer } from "mobx-react-lite";

const AvatarDraw = ({
    setMainOpen,
}: {
    setMainOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    const { appMode } = useAppStore();

    const [open, setOpen] = useState(false);

    const [brushColor, setBrushColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");

    const [size, setSize] = useState<number | string>(6);

    const [eraserMode, setEraserMode] = useState(false);

    const canvasRef = useRef<ReactSketchCanvasRef>(null);

    const { mutate: updateAvatar, isPending } = useMutation({
        mutationKey: ["updateAvatar"],
        mutationFn: (avatar: any) =>
            api.patch(
                "/@me",
                { avatar },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            ),
        onSuccess: () => {
            setOpen(false);
            canvasRef.current?.clearCanvas();
            setMainOpen(false);
        },
    });

    const changeSize = (e: ChangeEvent<HTMLInputElement>) => {
        if (isNaN(parseInt(e.target.value)) && e.target.value !== "") return;
        setSize(parseInt(e.target.value));
    };

    const onUpload = async () => {
        const data = await canvasRef.current?.exportImage("png");
        const blob = data ? await fetch(data).then((res) => res.blob()) : null;
        if (!blob) return;
        updateAvatar(blob);
    };

    const onClose = () => {
        setOpen(false);
        canvasRef.current?.clearCanvas();
    };

    const toggleEraser = (value: boolean) => {
        setEraserMode(value);
        canvasRef.current?.eraseMode(value);
    };

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                size="small"
                variant="outlined"
                color={
                    appMode.current === "servers" || appMode.current === "dms"
                        ? "success"
                        : "primary"
                }
            >
                Draw
            </Button>
            <Modal
                className="flex justify-center items-center"
                open={open}
                onClose={onClose}
            >
                <Stack
                    direction="row"
                    gap={2}
                    className={classNames(
                        "bg-neutral-900 border rounded-lg p-4",
                        {
                            "border-green-500/60":
                                appMode.current === "servers" ||
                                appMode.current === "dms",
                            "border-blue-500/60": appMode.current === "posts",
                        }
                    )}
                    justifyContent="center"
                    alignItems="center"
                >
                    <Stack
                        direction="column"
                        gap={2}
                        justifyContent="center"
                        alignItems="center"
                        className={classNames("border rounded-md p-2", {
                            "border-green-500/60":
                                appMode.current === "servers" ||
                                appMode.current === "dms",
                            "border-blue-500/60": appMode.current === "posts",
                        })}
                    >
                        <Stack
                            direction="column"
                            gap={0.5}
                            justifyContent="center"
                            alignItems="center"
                        >
                            {eraserMode ? (
                                <FaEraser
                                    size={26}
                                    onClick={() => toggleEraser(false)}
                                />
                            ) : (
                                <FaPaintBrush
                                    size={26}
                                    onClick={() => toggleEraser(true)}
                                />
                            )}
                            <Typography variant="button">
                                {eraserMode ? "Eraser" : "Brush"} Mode
                            </Typography>
                        </Stack>
                        <Stack
                            direction="column"
                            gap={0.5}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <input
                                value={size}
                                onChange={changeSize}
                                className="w-20 bg-neutral-700 text-neutral-200 rounded-md pl-1"
                                color={
                                    appMode.current === "servers" ||
                                    appMode.current === "dms"
                                        ? Colors.servers
                                        : Colors.posts
                                }
                                pattern="\d*"
                                type="number"
                            />
                            <Typography variant="button">
                                {eraserMode ? "Eraser" : "Brush"} Size
                            </Typography>
                        </Stack>
                        {!eraserMode && (
                            <Stack
                                direction="column"
                                gap={0.5}
                                justifyContent="center"
                                alignItems="center"
                            >
                                <PopoverPicker
                                    color={brushColor}
                                    onChange={(color: string) =>
                                        setBrushColor(color)
                                    }
                                />
                                <Typography variant="button">
                                    Brush Color
                                </Typography>
                            </Stack>
                        )}
                        <Stack
                            direction="column"
                            gap={0.5}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <PopoverPicker
                                color={bgColor}
                                onChange={(color: string) => setBgColor(color)}
                                classNames={classNames("border", {
                                    "border-green-500/60":
                                        appMode.current === "servers" ||
                                        appMode.current === "dms",
                                    "border-blue-500/60":
                                        appMode.current === "posts",
                                })}
                            />
                            <Typography variant="button">
                                Background Color
                            </Typography>
                        </Stack>
                    </Stack>
                    <Box position="relative">
                        <ReactSketchCanvas
                            id="avatar-canvas"
                            strokeColor={brushColor}
                            strokeWidth={size as number}
                            eraserWidth={size as number}
                            canvasColor={bgColor}
                            ref={canvasRef}
                            width="512px"
                            height="512px"
                            svgStyle={{
                                borderRadius: "50%",
                            }}
                            style={{
                                border: `1px solid ${
                                    appMode.current === "servers" ||
                                    appMode.current === "dms"
                                        ? Colors.servers
                                        : Colors.posts
                                }`,
                                borderRadius: "50%",
                            }}
                        />
                    </Box>
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        gap={2}
                    >
                        <Button
                            color={
                                appMode.current === "servers" ||
                                appMode.current === "dms"
                                    ? "success"
                                    : "primary"
                            }
                            onClick={() => canvasRef.current?.clearCanvas()}
                            size="small"
                            variant="outlined"
                            disabled={isPending}
                        >
                            Clear
                        </Button>
                        <Button
                            color={
                                appMode.current === "servers" ||
                                appMode.current === "dms"
                                    ? "success"
                                    : "primary"
                            }
                            onClick={() => canvasRef.current?.undo()}
                            size="small"
                            variant="outlined"
                            disabled={isPending}
                        >
                            Undo
                        </Button>
                        <Button
                            color={
                                appMode.current === "servers" ||
                                appMode.current === "dms"
                                    ? "success"
                                    : "primary"
                            }
                            size="small"
                            variant="outlined"
                            onClick={() => canvasRef.current?.redo()}
                            disabled={isPending}
                        >
                            Redo
                        </Button>
                        <Button
                            color={
                                appMode.current === "servers" ||
                                appMode.current === "dms"
                                    ? "success"
                                    : "primary"
                            }
                            size="small"
                            variant="outlined"
                            onClick={onUpload}
                            disabled={isPending}
                        >
                            Upload
                        </Button>
                        <Button
                            color={
                                appMode.current === "servers" ||
                                appMode.current === "dms"
                                    ? "success"
                                    : "primary"
                            }
                            onClick={onClose}
                            size="small"
                            variant="outlined"
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Stack>
            </Modal>
        </>
    );
};

export default observer(AvatarDraw);
