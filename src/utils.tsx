import { User } from "@furxus/types";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import { FaBook, FaHashtag, FaVolumeUp } from "react-icons/fa";
import { materialDark as darkTheme } from "react-syntax-highlighter/dist/esm/styles/prism";

export const ChannelTypeIcons: Record<string, any> = {
    category: <FaBook />,
    text: <FaHashtag />,
    voice: <FaVolumeUp />,
};

export const MessageSkeleton = () =>
    new Array(10).fill(0).map((_, i) => (
        <Stack key={i} ml={2} className="mb-xs">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="w-20">
                <Skeleton height={20} width="80%" className="mb-xs" />
                <Skeleton height={10} width="60%" />
            </div>
        </Stack>
    ));

export const checkIfAdmin = (user: User) => {
    switch (user.type) {
        case "founder":
        case "co-founder":
        case "lead_developer":
        case "developer":
        case "moderator":
            return true;
        default:
            return false;
    }
};

export type ProfileSettingsPages = "account" | "profile";

export const Colors = {
    posts: "#3b82f6",
    servers: "#22C55E",
    dms: "#367588",
};

export const useSyntaxHighlighterTheme = () => {
    const theme = useTheme();

    // const styles = React.useMemo(() => {
    //   const baseTextStyles = {
    //     "color": "#393A34",
    //     "font-family": "\"Consolas\", \"Bitstream Vera Sans Mono\", \"Courier New\", Courier, monospace",
    //     "direction": "ltr",
    //     "text-align": "left",
    //     "white-space": "pre",
    //     "word-spacing": "normal",
    //     "word-break": "normal",
    //     "font-size": ".9em",
    //     "line-height": "1.2em",

    //     "-moz-tab-size": "4",
    //     "-o-tab-size": "4",
    //     "tab-size": "4",

    //     "-webkit-hyphens": "none",
    //     "-moz-hyphens": "none",
    //     "-ms-hyphens": "none",
    //     "hyphens": "none",
    //   }
    // }, [])

    const styles = darkTheme;

    delete styles['code[class*="language-"]']["background"];
    styles['pre[class*="language-"]']["background"] =
        theme.palette.background.default;
    styles['pre[class*="language-"]'][
        "border"
    ] = `1px solid ${theme.palette.divider}`;
    styles['pre[class*="language-"]']["borderRadius"] =
        theme.shape.borderRadius;

    return styles;
};

export const dataURLToFile = (dataURL: string, filename: string) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
};

export const randEl = <T extends any>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];
