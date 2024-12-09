import { useClickOutside } from "@/hooks";
import { useCallback, useRef, useState } from "react";

import { HexAlphaColorPicker } from "react-colorful";

import "@css/ColorPicker.css";

const PopoverPicker = ({
    color,
    onChange,
    classNames,
}: {
    color: string;
    onChange: any;
    classNames?: string;
}) => {
    const popover = useRef<any>(null);
    const [isOpen, toggle] = useState(false);

    const close = useCallback(() => toggle(false), []);
    useClickOutside(popover, close);

    return (
        <div className="relative">
            <div
                className={`w-7 h-7 rounded-lg border[3px] cursor-pointer ${classNames}`}
                onClick={() => toggle(true)}
                style={{
                    boxShadow:
                        "0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.1)",
                    backgroundColor: color,
                }}
            >
                {isOpen && (
                    <div
                        className="absolute top-1/2 translate-y-[-120%] left-1/2 translate-x-[-50%] bg-white"
                        ref={popover}
                        style={{
                            top: "calc(100% + 2px)",
                            borderRadius: "9px",
                            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                        }}
                    >
                        <HexAlphaColorPicker
                            color={color}
                            onChange={onChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PopoverPicker;
