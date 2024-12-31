"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { getUserByEmail } from "@/data/auth/user";
import { generateVerificationToken } from "@/data/auth/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { SignupFormValues } from "@/types/auth.types";
import { SignupSchema } from "@/schemas/auth.schema";

export const signup = async (values: SignupFormValues) => {
  const validateFields = SignupSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid fields." };
  }

  const { email, password } = validateFields.data;

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    values.password = hashedPassword;
  }

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use." };
  }

  const normalizedEmail = email.toLowerCase();

  try {
    await prisma.user.create({
      data: {
        ...values,
        email: normalizedEmail,
      },
    });
  } catch (error) {
    return { error: "Something went wrong." };
  }

  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation email sent." };
};
