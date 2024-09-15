import Stack from "@mui/material/Stack";
import ErrorMessage from "../components/ErrorMessage";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            className="h-screen"
            gap={2}
        >
            <ErrorMessage
                message="404 Not Found"
                subtext="The page you are looking for does not exist."
            />
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
