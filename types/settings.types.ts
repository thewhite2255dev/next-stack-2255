import * as z from "zod";
import {
  AccountFormSchema,
  AppearanceFormSchema,
  AuthenticationFormSchema,
  DeleteAccountSchema,
  PasswordFormSchema,
  ProfileFormSchema,
} from "@/schemas/settings.schema";

export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;
export type AccountFormValues = z.infer<typeof AccountFormSchema>;
export type DeleteAccountFormValues = z.infer<typeof DeleteAccountSchema>;
export type PasswordFormValues = z.infer<typeof PasswordFormSchema>;
export type AuthenticationFormValues = z.infer<typeof AuthenticationFormSchema>;
export type AppearanceFormValues = z.infer<typeof AppearanceFormSchema>;
