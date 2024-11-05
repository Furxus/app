import Stack from "@mui/material/Stack";
import Sidebar from "./components/Sidebar";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import Button from "@mui/material/Button";

const Layout = () => {
    const navigate = useNavigate();
    const { user: auth, logout, isLoggedIn } = useAuth();
    const [emailSent, setEmailSent] = useState(false);

    const { mutate: resendEmail } = useMutation({
        mutationKey: ["resendEmail"],
        mutationFn: () =>
            api.post("/auth/resend-email").then((res) => res.data),
        onSuccess: () => {
            setEmailSent(true);
        },
    });

    if (!isLoggedIn) return <Navigate to="/login" />;

    if (!auth?.verified)
        return (
            <Stack
                justifyContent="center"
                alignItems="center"
                className="h-dvh"
            >
                <Stack
                    justifyContent="center"
                    alignItems="center"
                    padding={4}
                    width={500}
                    className="border border-blue-500/60 rounded-xl bg-neutral-700/[0.05]"
                >
                    <Stack gap={2} direction="column">
                        {emailSent ? (
                            <>
                                <span className="text-green-500">
                                    Email sent successfully, please check your
                                    inbox and spam folder, and after verfiying
                                    your email you can login
                                </span>
                                <Button
                                    onClick={() => {
                                        setEmailSent(false);
                                        logout();
                                        navigate("/");
                                    }}
                                    variant="contained"
                                    color="success"
                                >
                                    Login
                                </Button>
                            </>
                        ) : (
                            <>
                                <span className="text-red-500">
                                    Email not verified, please make sure that
                                    you have verified your email or you can
                                    request a new verification code
                                </span>
                                <Button
                                    onClick={() => resendEmail()}
                                    variant="contained"
                                    color="success"
                                >
                                    Resend Email
                                </Button>
                            </>
                        )}
                    </Stack>
                </Stack>
            </Stack>
        );

    return (
        <Stack direction="row">
            <Sidebar />
            <Stack className="w-full h-dvh">
                <Outlet />
            </Stack>
        </Stack>
    );
};

export default Layout;
