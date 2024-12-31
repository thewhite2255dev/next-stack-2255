"use server";

import { getUserById } from "@/data/auth/user";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ProfileFormValues } from "@/types/settings.types";

export const updateProfile = async (values: ProfileFormValues) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized." };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: "Unauthorized." };
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

  return { success: "Profile updated." };
};
