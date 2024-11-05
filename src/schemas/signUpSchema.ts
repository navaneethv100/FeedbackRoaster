import { z } from "zod";

export const usernameVaidation  = z
    .string()
    .min(2, "Username must be at least 2 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(/^[a-zA-Z0-9]+$/, "Username must contain only letters and numbers");

    export const signUpSchema = z.object({
        username: usernameVaidation,
        email: z.string()
            .email("Invalid email address"),
        password: z.string()
            .min(6, "Password must be at least 6 characters long")
    })

    