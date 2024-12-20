import { useState } from "react";
import { useAuth } from "../../hooks";
import { Navigate, useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import { RegisterSchema } from "../../ValidationSchemas";

import Stack from "@mui/material/Stack";

import { DatePicker } from "@mui/x-date-pickers";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [dob, setDob] = useState<Date | null>(null);

    const { isLoggedIn } = useAuth();

    const [successful, setSuccessful] = useState(false);

    const [serverErrors, setServerErrors] = useState<
        Record<string, string | null>
    >({
        email: null,
        username: null,
        displayName: null,
        password: null,
        confirmPassword: null,
        dateOfBirth: null,
    });

    // const [registerUser] = useMutation(RegisterUser, {
    //     onCompleted: () => {
    //         setSuccessful(true);
    //     },
    //     onError: (error) => {
    //         const errs = error.graphQLErrors[0].extensions?.errors as any[];
    //         if (errs) {
    //             errs.forEach((e) => {
    //                 setServerErrors((prev) => ({
    //                     ...prev,
    //                     [e.type]: e.message,
    //                 }));
    //             });
    //         }
    //     },
    // });

    const { mutate } = useMutation({
        mutationKey: ["register"],
        mutationFn: (values: any) => api.post("/auth/register", values),
        onSuccess: () => {
            setSuccessful(true);
        },
        onError: (err: any) => {
            const errors = err.response.data.errors as any[];
            errors?.forEach((error) => {
                setServerErrors({
                    ...serverErrors,
                    [error.type]: error.message,
                });
            });
        },
    });

    if (isLoggedIn) return <Navigate to="/" />;

    const fields: Record<any, any>[] = [
        {
            name: "email",
            label: "Email",
            required: true,
        },
        {
            name: "username",
            label: "Username",
            type: "text",
            required: true,
        },
        {
            name: "displayName",
            label: "Display Name",
            type: "text",
        },
        {
            name: "password",
            label: "Password",
            type: "password",
            required: true,
        },
        {
            name: "confirmPassword",
            label: "Confirm Password",
            type: "password",
            required: true,
        },
    ];

    return (
        <Stack justifyContent="center" alignItems="center" className="h-dvh">
            <Stack
                justifyContent="center"
                alignItems="center"
                width="500px"
                padding="2.5rem"
                className="rounded-xl gradient-box bg-neutral-700/[0.05] border border-blue-500/60"
            >
                {successful ? (
                    <Stack justifyContent="center" alignItems="center" gap={2}>
                        <span className="text-lg">
                            Account was created successfully
                        </span>
                        <span className="text-sm">
                            Please verify your email to login
                        </span>
                        <Button
                            color="success"
                            variant="contained"
                            size="medium"
                            fullWidth
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </Button>
                    </Stack>
                ) : (
                    <Stack
                        justifyContent="center"
                        alignItems="center"
                        className="w-full"
                    >
                        <span className="text-lg">Create an account</span>
                        <Stack
                            justifyContent="center"
                            alignItems="center"
                            className="w-full"
                        >
                            <Formik
                                initialValues={{
                                    email: "",
                                    username: "",
                                    displayName: "",
                                    password: "",
                                    confirmPassword: "",
                                }}
                                validationSchema={RegisterSchema}
                                onSubmit={(values) =>
                                    mutate({
                                        ...values,
                                        dateOfBirth: dob,
                                    })
                                }
                            >
                                {({
                                    errors,
                                    handleChange,
                                    touched,
                                    values,
                                }) => (
                                    <Form className="w-full">
                                        <Stack
                                            justifyContent="center"
                                            alignItems="center"
                                            gap={2}
                                            className="pt-8 px-8 py-4 w-full"
                                        >
                                            {fields.map((field) => (
                                                <Stack
                                                    key={field.name}
                                                    gap={4}
                                                    className="w-full"
                                                >
                                                    <TextField
                                                        id={field.name}
                                                        name={field.name}
                                                        label={field.label}
                                                        onChange={handleChange}
                                                        autoComplete="off"
                                                        fullWidth
                                                        error={
                                                            (touched[
                                                                field.name as keyof typeof touched
                                                            ] &&
                                                                !!errors[
                                                                    field.name as keyof typeof errors
                                                                ]) ||
                                                            !!serverErrors[
                                                                field.name
                                                            ]
                                                        }
                                                        helperText={
                                                            (touched[
                                                                field.name as keyof typeof touched
                                                            ] &&
                                                                errors[
                                                                    field.name as keyof typeof errors
                                                                ]) ||
                                                            serverErrors[
                                                                field.name
                                                            ]
                                                        }
                                                        type={
                                                            field.type ===
                                                            "password"
                                                                ? showPassword
                                                                    ? "text"
                                                                    : "password"
                                                                : field.type
                                                        }
                                                        required={
                                                            field.required
                                                        }
                                                        value={
                                                            values[
                                                                field.name as keyof typeof errors
                                                            ] ?? ""
                                                        }
                                                        slotProps={
                                                            field.type ===
                                                            "password"
                                                                ? {
                                                                      input: {
                                                                          endAdornment:
                                                                              showPassword ? (
                                                                                  <FaEye
                                                                                      className="cursor-pointer"
                                                                                      size={
                                                                                          24
                                                                                      }
                                                                                      onClick={() =>
                                                                                          setShowPassword(
                                                                                              false
                                                                                          )
                                                                                      }
                                                                                  />
                                                                              ) : (
                                                                                  <FaEyeSlash
                                                                                      className="cursor-pointer"
                                                                                      size={
                                                                                          24
                                                                                      }
                                                                                      onClick={() =>
                                                                                          setShowPassword(
                                                                                              true
                                                                                          )
                                                                                      }
                                                                                  />
                                                                              ),
                                                                      },
                                                                  }
                                                                : undefined
                                                        }
                                                    />
                                                </Stack>
                                            ))}
                                            <Stack
                                                key="dateOfBirth"
                                                direction="column"
                                                gap="4px"
                                                className="w-full"
                                            >
                                                <DatePicker
                                                    onChange={(date) =>
                                                        setDob(date ?? null)
                                                    }
                                                    value={dob}
                                                />
                                                {serverErrors.dateOfBirth && (
                                                    <span className="text-red-500">
                                                        {
                                                            serverErrors.dateOfBirth
                                                        }
                                                    </span>
                                                )}
                                            </Stack>
                                            <Stack
                                                direction="column"
                                                mt={2}
                                                gap={1}
                                            >
                                                <Button
                                                    variant="contained"
                                                    size="large"
                                                    color="success"
                                                    sx={{ color: "white" }}
                                                    onClick={() => {
                                                        mutate({
                                                            ...values,
                                                            dateOfBirth: dob,
                                                        });
                                                    }}
                                                >
                                                    Register
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        navigate("/login")
                                                    }
                                                    variant="text"
                                                >
                                                    Already have an account?
                                                    Login
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </Form>
                                )}
                            </Formik>
                        </Stack>
                    </Stack>
                )}
            </Stack>
        </Stack>
    );
};

export default RegisterPage;
