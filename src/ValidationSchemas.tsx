import { isDate, parse, sub } from "date-fns";
import { date, object, string, mixed, ref } from "yup";

const pswdRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

export const LoginSchema = object().shape({
    usernameOrEmail: string()
        .required("Username or email is required")
        .min(4, "Username or email must be at least 4 characters")
        .max(30, "Username or email must be at most 30 characters"),
    password: string().required("Password is required"),
});

export const RegisterSchema = object().shape({
    email: string()
        .email("Email must be a valid email address")
        .required("Email is required"),
    username: string()
        .min(4, "Username must be at least 4 characters")
        .max(30, "Username must be at most 30 characters")
        .required("Username is required"),
    displayName: string().nullable(),
    password: string()
        .matches(
            pswdRegex,
            "Password must be a valid password, containing at least 1 uppercase letter, 1 lowercase letter, 1 number, and 8 characters"
        )
        .required("Password is required"),
    confirmPassword: string()
        .matches(
            pswdRegex,
            "Password must be a valid password, containing at least 1 uppercase letter, 1 lowercase letter, 1 number, and 8 characters"
        )
        .required("Confirm password is required")
        .when("password", {
            is: (val: string) => val !== "",
            then: (schema) =>
                schema
                    .required()
                    .oneOf([ref("password")], "Passwords must match"),
        }),
    dateOfBirth: date()
        .nonNullable()
        .required()
        .transform((_, orig) =>
            isDate(orig) ? orig : parse(orig, "mm/dd/yyyy", new Date())
        )
        .typeError("Invalid date of birth, must be in the format mm/dd/yyyy")
        .max(
            sub(new Date(), { years: 13 }),
            "You must be at least 13 years old"
        ),
});

export const CreateServerSchema = object().shape({
    name: string()
        .min(4, "Server name must be at least 4 characters")
        .max(30, "Server name must be at most 30 characters")
        .required("Server name is required"),
    icon: mixed().nullable(),
});
