import Stack from "@mui/material/Stack";
import Sidebar from "./components/Sidebar.component";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, socket } from "@/api";
import Button from "@mui/material/Button";

const Layout = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
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

    useEffect(() => {
        socket.on("user:update", (user) => {
            queryClient.setQueryData(["getMessages"], (old: any) => {
                return old.map((msg: any) => {
                    if (msg.author.id === user.id) {
                        return { ...msg, author: user };
                    }
                    return msg;
                });
            });
        });
    }, []);

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
                                <Stack
                                    direction="row"
                                    className="w-full"
                                    justifyContent="center"
                                    gap={2}
                                >
                                    <Button
                                        onClick={() => resendEmail()}
                                        variant="contained"
                                        color="success"
                                    >
                                        Resend Email
                                    </Button>
                                    <Button
                                        onClick={() => logout()}
                                        variant="contained"
                                        color="error"
                                    >
                                        Logout
                                    </Button>
                                </Stack>
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
