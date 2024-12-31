"use server";

import { getUserByEmail } from "@/data/auth/user";
import { getPasswordResetTokenByToken } from "@/data/auth/password-reset-token";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NewPasswordFormValues } from "@/types/auth.types";
import { NewPasswordSchema } from "@/schemas/auth.schema";

export const newPassword = async (
  values: NewPasswordFormValues,
  token?: string | null,
) => {
  if (!token) {
    return { error: "Missing token." };
  }

  const validateFields = NewPasswordSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid fields." };
  }

  const { password } = validateFields.data;

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    values.password = hashedPassword;
  }

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token." };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired." };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist." };
  }

  try {
    await prisma.user.update({
      where: {
        id: existingUser.id,
      },

      data: {
        email: existingToken.email,
      },
    });

    await prisma.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  } catch (error) {
    return { error: "Something went wrong." };
  }

  return { success: "Password updated." };
};
