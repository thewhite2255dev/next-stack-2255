"use server";

import { getUserById, getUserByUsername } from "@/data/auth/user";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { AccountFormValues } from "@/types/settings.types";

export const updateAccount = async (values: AccountFormValues) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized." };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized." };
  }

  if (values.username && values.username !== dbUser.username) {
    const existingUser = await getUserByUsername(values.username);

    if (existingUser) {
      return { error: "Username already taken." };
    }
  }

  try {
    await prisma.user.update({
      where: {
        id: dbUser.id,
      },
      data: { ...values },
    });
  } catch (error) {
    return { error: "Something went wrong." };
  }

  revalidatePath("/");

  return { success: "Account updated." };
};
