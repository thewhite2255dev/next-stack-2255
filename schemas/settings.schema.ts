import { UserRole } from "@prisma/client";
import * as z from "zod";

export const ProfileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(50, {
      message: "Name must not be longer than 30 characters.",
    })
    .optional(),
  email: z
    .string({
      required_error: "Please enter an email.",
    })
    .email(),
  bio: z.string().max(160, "Bio cannot exceed 160 characters.").optional(),
  location: z
    .string()
    .max(100, "Location cannot exceed 100 characters.")
    .optional(),
});

export const AccountFormSchema = z.object({
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
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
});

export const DeleteAccountSchema = z
  .object({
    email: z.string().email({
      message: "Email is required.",
    }),
    confirmation: z.string().min(1, {
      message: "Confirmation is required.",
    }),
    password: z.string().min(1, {
      message: "Password is required.",
    }),
  })
  .refine(
    (data) => {
      if (data.confirmation !== "delete my account") {
        return false;
      }
      return true;
    },
    {
      message: "You must type 'delete my account' to confirm.",
      path: ["confirmation"],
    },
  );

export const PasswordFormSchema = z
  .object({
    password: z.optional(
      z.string().min(1, {
        message: "Current password is required.",
      }),
    ),
    newPassword: z.optional(
      z.string().min(6, {
        message: "New password must be at least 6 characters.",
      }),
    ),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required.",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },

    {
      message: "Password is required.",
      path: ["password"],
    },
  );

export const AuthenticationFormSchema = z.object({
  isTwoFactorEnabled: z.boolean(),
});

export const AppearanceFormSchema = z.object({
  theme: z.enum(["light", "dark"], {
    required_error: "Please select a theme.",
  }),
});
