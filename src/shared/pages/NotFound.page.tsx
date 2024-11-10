import Stack from "@mui/material/Stack";

import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            className="h-dvh"
            gap={2}
        >
            <Typography variant="h1">404 Not found</Typography>
            <Typography variant="h4">
                The page you are looking for does not exist.
            </Typography>
            <Stack gap={1} justifyContent="center" alignItems="center">
                <span className="text-lg">Go back to </span>
                <Stack
                    gap={1}
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Button
                        onClick={() => navigate("/servers")}
                        variant="outlined"
                        color="success"
                    >
                        Servers
                    </Button>
                    <Button
                        onClick={() => navigate("/users")}
                        variant="outlined"
                        color="info"
                    >
                        DMs
                    </Button>
                    <Button
                        onClick={() => navigate("/posts")}
                        variant="outlined"
                        color="primary"
                    >
                        Posts
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default NotFound;
