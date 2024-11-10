import { api } from "@/api";
import { useAuth } from "@/hooks";
import Stack from "@mui/material/Stack";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const VerifyPage = () => {
    const { code } = useParams();
    const { logout } = useAuth();
    const navigation = useNavigate();
    const [countdown, setCountdown] = useState(5);

    const {
        error,
        isPending,
        data: verifyUser,
    } = useQuery({
        queryKey: ["verifyUser", { code }],
        queryFn: () =>
            api.post("/auth/verify", { code }).then((res) => res.data),
    });

    // const {
    //     loading,
    //     data: { verifyUser = false } = {},
    //     error,
    // } = useQuery(VerifyUser, {
    //     variables: {
    //         code,
    //     },
    // });

    useEffect(() => {
        if (isPending) return;
        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isPending]);

    if (countdown === 0) {
        navigation("/login");
        logout();
    }

    return (
        <Stack justifyContent="center" alignItems="center" className="h-dvh">
            <Stack
                justifyContent="center"
                alignItems="center"
                gap={1}
                className="bg-neutral-700/40 p-4"
            >
                {isPending && <p>Verifying your email...</p>}
                {error && <p>{error.message}</p>}
                {verifyUser && (
                    <>
                        <p className="text-green-500 font-bold">
                            Your email has been verified!
                        </p>
                        <span className="text-sm font-semibold">
                            You will be automatically redirected to the page the
                            login page in {countdown} seconds
                        </span>
                    </>
                )}
            </Stack>
        </Stack>
    );
};

export default VerifyPage;
