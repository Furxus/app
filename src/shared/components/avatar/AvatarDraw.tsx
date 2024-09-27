import { useAppMode } from "@/hooks";
import { Box, Button, Modal, Stack } from "@mui/material";
import classNames from "classnames";
import { useRef, useState } from "react";

import CanvasDraw from "react-canvas-draw";

const AvatarDraw = () => {
    const { appMode } = useAppMode();

    const [open, setOpen] = useState(false);
    const canvasRef = useRef<CanvasDraw>(null);
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
                >
                    <CanvasDraw
                        style={{
                            width: "100%",
                        }}
                        ref={canvasRef}
                    />
                    <Stack
                        direction="row"
                        gap={2}
                        justifyContent="space-between"
                    >
                        <Stack direction="row" gap={1}>
                            <Button
                                onClick={() => canvasRef.current?.clear()}
                                size="small"
                                variant="outlined"
                            >
                                Clear
                            </Button>
                            <Button
                                onClick={() => canvasRef.current?.undo()}
                                size="small"
                                variant="outlined"
                            >
                                Undo
                            </Button>
                        </Stack>
                        <Stack direction="row" gap={1}>
                            <Button size="small" variant="outlined">
                                Save
                            </Button>
                            <Button
                                onClick={onClose}
                                size="small"
                                variant="outlined"
                            >
                                Cancel
                            </Button>
                        </Stack>
                        <Stack direction="row" gap={1}>
                            <Button size="small" variant="outlined">
                                Upload
                            </Button>
                            <Button
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
