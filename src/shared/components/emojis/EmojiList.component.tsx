import { useAppStore } from "@/hooks/useAppStore";
import Stack from "@mui/material/Stack";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const EmojiList = forwardRef((props: any, ref: any) => {
    const { appMode } = useAppStore();

    const [emojiIndex, select] = useState(0);

    const { items } = props;

    const selectEmoji = (i: any) => {
        const item = items[i];

        if (item) props.command({ name: item.name });
    };

    const upHandler = () =>
        select((emojiIndex + props.items.length - 1) % props.items.length);

    const downHandler = () => select((emojiIndex + 1) % props.items.length);

    const enterHandler = () => selectEmoji(emojiIndex);

    useEffect(() => select(0), [items]);

    useImperativeHandle(
        ref,
        () => ({
            onKeyDown: (x: any) => {
                if (x.event.key === "ArrowUp") {
                    upHandler();
                    return true;
                }

                if (x.event.key === "ArrowDown") {
                    downHandler();
                    return true;
                }

                if (x.event.key === "Enter") {
                    enterHandler();
                    return true;
                }

                return false;
            },
        }),
        [upHandler, downHandler, enterHandler]
    );

    return (
        <Stack
            className={classNames("bg-neutral-700 rounded-xl w-full border", {
                "border-green-500/60": appMode.current === "servers",
            })}
            direction="column"
            gap={1}
            p={1}
        >
            {items.map((item: any, i: any) => (
                <Stack
                    className="hover:bg-neutral-600 rounded-lg p-1 w-full"
                    direction="row"
                    key={item.name}
                    gap={1}
                    alignItems="center"
                    onClick={() => selectEmoji(i)}
                    color="inherit"
                >
                    {item.fallbackImage ? (
                        <img
                            src={item.fallbackImage}
                            alt={item.name}
                            style={{
                                width: "1.5rem",
                                height: "1.5rem",
                            }}
                        />
                    ) : (
                        <>{item.emoji}</>
                    )}
                    :{item.name}:
                </Stack>
            ))}
        </Stack>
    );
});

export default observer(EmojiList);
