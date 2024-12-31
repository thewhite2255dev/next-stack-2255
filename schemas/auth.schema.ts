import * as z from "zod";
import { UserRole } from "@prisma/client";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  code: z.optional(z.string()),
});

export const SignupSchema = z.object({
  email: z.string().email({
    message: "Email is required.",
  }),
  password: z.string().min(6, {
    message: "Minimum of 6 characters is required.",
  }),
  name: z
    .string()
    .min(1, {
      message: "Name is required.",
    })
    .max(50, {
      message: "Name must not be longer than 50 characters.",
    }),
  username: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    })
    .regex(
      /^[a-zA-Z0-9](?:[a-zA-Z0-9_-]*[a-zA-Z0-9])?$/,
      "Username can only contain letters, numbers, underscores (_), or dashes (-), and cannot start or end with special characters.",
    ),
});

export const getStartedFormSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters is required.",
  }),
  name: z
    .string()
    .min(1, {
      message: "Name is required.",
    })
    .max(50, {
      message: "Name must not be longer than 50 characters.",
    }),
  username: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    })
    .regex(
      /^[a-zA-Z0-9](?:[a-zA-Z0-9_-]*[a-zA-Z0-9])?$/,
      "Username can only contain letters, numbers, underscores (_), or dashes (-), and cannot start or end with special characters.",
    ),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters is required.",
  }),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Email is required.",
  }),
});
