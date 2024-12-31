"use server";

import { getUserByEmail } from "@/data/auth/user";
import { generateTwoFactorToken } from "@/data/auth/tokens";
import { sendTwoFactorTokenEmail } from "@/lib/mail";

export const resendCode = async (email: string) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { error: "Email does not exist." };
    }

    if (!existingUser.isTwoFactorEnabled) {
      return { error: "Two-factor authentication is not enabled." };
    }

    const twoFactorToken = await generateTwoFactorToken(existingUser.email);

    await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);

    return { success: "Code sent." };
  } catch (error) {
    return { error: "Something went wrong." };
  }
};
