import { useEffect, useState } from "react";
import { useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LoginUser } from "../../gql/auth";

import { LoginSchema } from "../../ValidationSchemas";
import { Form, Formik } from "formik";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

type ServerError = {
    usernameOrEmail?: string;
    password?: string;
};

const LoginPage = () => {
    const navigate = useNavigate();

    const { isLoggedIn, login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const [srvErrors, setSrvErrors] = useState<ServerError>();

    useEffect(() => {
        if (isLoggedIn) navigate("/");
    }, [isLoggedIn]);

    const [loginUser] = useMutation(LoginUser, {
        onCompleted: ({ loginUser: userData }) => {
            login(userData);
        },
        onError: (err) => {
            const errors = err.graphQLErrors[0].extensions?.errors as any[];
            errors?.forEach((error) => {
                setSrvErrors({
                    ...srvErrors,
                    [error.type]: error.message,
                });
            });
        },
    });

    if (isLoggedIn) return <></>;

    return (
        <Stack justifyContent="center" alignItems="center" className="h-dvh">
            <Stack
                justifyContent="center"
                alignItems="center"
                padding={4}
                gap={4}
                width={500}
                className="border gradient-box rounded-xl bg-neutral-700/[0.05]"
            >
                <Stack direction="row" className="text-xl">
                    <span>Login to&nbsp;</span>
                    <span className="font-bold">Furxus</span>
                </Stack>
                <Stack justifyContent="center" alignItems="center">
                    <Formik
                        initialValues={{
                            usernameOrEmail: "",
                            password: "",
                        }}
                        validationSchema={LoginSchema}
                        onSubmit={(values) => loginUser({ variables: values })}
                    >
                        {({ errors, handleChange, touched, values }) => (
                            <Form className="w-full">
                                <Stack
                                    justifyContent="center"
                                    alignItems="center"
                                    className="w-full"
                                    gap={2}
                                >
                                    <Stack gap={4} className="w-full">
                                        <TextField
                                            label="Username or Email"
                                            id="usernameOrEmail"
                                            name="usernameOrEmail"
                                            onChange={handleChange}
                                            autoComplete="off"
                                            error={
                                                (!!errors.usernameOrEmail ||
                                                    !!srvErrors?.usernameOrEmail) &&
                                                touched.usernameOrEmail
                                            }
                                            value={values.usernameOrEmail}
                                            required
                                            type="text"
                                            helperText={
                                                touched.usernameOrEmail &&
                                                (errors.usernameOrEmail ||
                                                    srvErrors?.usernameOrEmail)
                                            }
                                        />
                                    </Stack>
                                    <Stack
                                        direction="column"
                                        gap={4}
                                        className="w-full"
                                    >
                                        <TextField
                                            label="Password"
                                            id="password"
                                            name="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            onChange={handleChange}
                                            error={
                                                (!!errors.password ||
                                                    !!srvErrors?.password) &&
                                                touched.password
                                            }
                                            helperText={
                                                touched.password &&
                                                (errors.password ||
                                                    srvErrors?.password)
                                            }
                                            value={values.password}
                                            required
                                            slotProps={{
                                                input: {
                                                    endAdornment:
                                                        showPassword ? (
                                                            <FaEye
                                                                className="cursor-pointer"
                                                                size={24}
                                                                onClick={() =>
                                                                    setShowPassword(
                                                                        false
                                                                    )
                                                                }
                                                            />
                                                        ) : (
                                                            <FaEyeSlash
                                                                className="cursor-pointer"
                                                                size={24}
                                                                onClick={() =>
                                                                    setShowPassword(
                                                                        true
                                                                    )
                                                                }
                                                            />
                                                        ),
                                                },
                                            }}
                                        />
                                    </Stack>
                                    <Stack direction="column" gap={1} mt={2}>
                                        <Button
                                            size="large"
                                            color="success"
                                            type="submit"
                                            variant="contained"
                                            sx={{ color: "white" }}
                                        >
                                            Login
                                        </Button>
                                        <Button
                                            variant="text"
                                            onClick={() =>
                                                navigate("/register")
                                            }
                                        >
                                            Don&apos;t have an account? Register
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Form>
                        )}
                    </Formik>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default LoginPage;
