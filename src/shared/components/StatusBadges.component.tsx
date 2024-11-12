import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";

export const OnlineBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-dot": {
        backgroundColor: theme.palette.success.main,
        width: 10,
        height: 10,
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    },
}));

export const OfflineBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-dot": {
        backgroundColor: theme.palette.grey[500],
        width: 10,
        height: 10,
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    },
}));

export const IdleBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-dot": {
        backgroundColor: theme.palette.warning.main,
        width: 10,
        height: 10,
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    },
}));

export const DNDBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-dot": {
        backgroundColor: theme.palette.error.main,
        width: 10,
        height: 10,
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    },
}));
