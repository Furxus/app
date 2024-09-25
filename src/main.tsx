import "@fontsource/montserrat";

import "@css/index.css";
import "react-contexify/dist/ReactContexify.css";

import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import MainProvider from "./providers/MainProvider";

const container = document.getElementById("app");
const root = createRoot(container!);

if (import.meta.env.DEV === true) {
    root.render(
        <StrictMode>
            <MainProvider />
        </StrictMode>
    );
} else {
    root.render(<MainProvider />);
}
