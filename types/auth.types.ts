import * as z from "zod";
import {
  ForgotPasswordSchema,
  getStartedFormSchema,
  LoginSchema,
  NewPasswordSchema,
  SignupSchema,
} from "@/schemas/auth.schema";

export type LoginFormValues = z.infer<typeof LoginSchema>;
export type SignupFormValues = z.infer<typeof SignupSchema>;
export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;
export type NewPasswordFormValues = z.infer<typeof NewPasswordSchema>;
export type getStartedFormValues = z.infer<typeof getStartedFormSchema>;
