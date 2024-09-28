import { useClickOutside } from "@/hooks";
import { useCallback, useRef, useState } from "react";

import { HexColorPicker } from "react-colorful";

import "@css/ColorPicker.css";

const PopoverPicker = ({
    color,
    onChange,
}: {
    color: string;
    onChange: any;
}) => {
    const popover = useRef<any>();
    const [isOpen, toggle] = useState(false);

    const close = useCallback(() => toggle(false), []);
    useClickOutside(popover, close);

    return (
        <div className="relative">
            <div
                className="w-7 h-7 rounded-lg border[3px] cursor-pointer"
                onClick={() => toggle(true)}
                style={{
                    boxShadow:
                        "0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.1);",
                    backgroundColor: color,
                }}
            >
                {isOpen && (
                    <div
                        className="absolute right-1/2 transform translate-x-1/2 mt-2"
                        ref={popover}
                        style={{
                            top: "calc(100% + 2px)",
                            borderRadius: "9px",
                            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15);",
                        }}
                    >
                        <HexColorPicker color={color} onChange={onChange} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PopoverPicker;
