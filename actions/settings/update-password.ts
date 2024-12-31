"use server";

import bcrypt from "bcryptjs";

import { getUserById } from "@/data/auth/user";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { PasswordFormValues } from "@/types/settings.types";

export const updatePassword = async (values: PasswordFormValues) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized." };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: "Unauthorized." };
  }

  const updateData: Partial<Pick<typeof dbUser, "password">> = {};

  if (values.password && values.newPassword) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password as string,
    );

    if (!passwordsMatch) {
      return { error: "Incorrect password." };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword as string, 10);
    updateData.password = hashedPassword;
  }

  try {
    await prisma.user.update({
      where: {
        id: dbUser.id,
      },
      data: updateData,
    });
  } catch (error) {
    return { error: "Something went wrong." };
  }

  revalidatePath("/");

  return { success: "Password updated." };
};
