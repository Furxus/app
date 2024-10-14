import { Component, PropsWithChildren } from "react";

export type ScrollableFeedProps = {
    forceScroll?: boolean;
    animateScroll?: (element: HTMLElement, offset: number) => void;
    onScrollComplete?: () => void;
    changeDetectionFilter?: (
        previousProps: ScrollableFeedComponentProps,
        newProps: ScrollableFeedComponentProps
    ) => boolean;
    viewableDetectionEpsilon?: number;
    className?: string;
    onScroll?: (isAt: "top" | "bottom") => void;
    debug?: boolean;
};

type ScrollableFeedComponentProps = PropsWithChildren<ScrollableFeedProps>;

export class ScrollableFeed extends Component<PropsWithChildren<ScrollableFeedProps>> {
    
}