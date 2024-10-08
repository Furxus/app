import Stack from "@mui/material/Stack";
import Sidebar from "./components/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import { Button } from "@mui/material";
import { useMutation } from "@apollo/client";
import { ResendEmail } from "@/gql/auth";
import { useState } from "react";

const Layout = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [emailSent, setEmailSent] = useState(false);

    const [resendEmail] = useMutation(ResendEmail, {
        onCompleted: () => {
            setEmailSent(true);
        },
    });

    if (!user.verified)
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
