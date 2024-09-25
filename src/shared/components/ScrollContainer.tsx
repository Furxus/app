import { PropsWithChildren, useEffect, useRef } from "react";
const ScrollContainer = ({
    children,
    className,
    reverse,
}: PropsWithChildren & {
    className?: string;
    reverse?: boolean;
}) => {
    const outerDiv = useRef<HTMLDivElement>(null);
    const innerDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const outerHeight = outerDiv.current?.clientHeight ?? 0;
        const innerHeight = innerDiv.current?.clientHeight ?? 0;

        if (reverse) {
            outerDiv.current?.scrollTo({
                top: 0,
                left: 0,
            });
            return;
        }

        outerDiv.current?.scrollTo({
            top: innerHeight - outerHeight,
            left: 0,
        });
    }, []);

    useEffect(() => {
        const outerHeight = outerDiv.current?.clientHeight ?? 0;
        const innerHeight = innerDiv.current?.clientHeight ?? 0;

        if (reverse) {
            outerDiv.current?.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
            });
            return;
        }

        outerDiv.current?.scrollTo({
            top: innerHeight - outerHeight,
            left: 0,
            behavior: "smooth",
        });
    }, [children]);

    return (
        <div
            className="w-full"
            ref={outerDiv}
            style={{
                position: "relative",
                height: "100%",
                overflowY: "scroll",
            }}
        >
            <div
                className={className ?? ""}
                ref={innerDiv}
                style={{ position: "relative" }}
            >
                {children}
            </div>
        </div>
    );
};

export default ScrollContainer;
