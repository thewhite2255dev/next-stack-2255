"use server";

import { getUserByEmail } from "@/data/auth/user";
import { generatePasswordResetToken } from "@/data/auth/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";
import { ForgotPasswordFormValues } from "@/types/auth.types";
import { ForgotPasswordSchema } from "@/schemas/auth.schema";

export const forgotPassword = async (values: ForgotPasswordFormValues) => {
  const validateFields = ForgotPasswordSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid email." };
  }

  const { email } = validateFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email does not exist." };
  }

  const passwordToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(passwordToken.email, passwordToken.token);

  return { success: "Reset email sent." };
};
