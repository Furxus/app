import { Tooltip as MTooltip } from "@mui/material";

const Tooltip = ({ children, ...props }: any) => (
    <MTooltip {...props}>
        <span>{children}</span>
    </MTooltip>
);

export default Tooltip;
