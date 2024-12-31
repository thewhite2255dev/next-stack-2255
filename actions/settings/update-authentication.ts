"use server";

import { getUserById } from "@/data/auth/user";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { AuthenticationFormValues } from "@/types/settings.types";

export const updateAuthentication = async (
  values: AuthenticationFormValues,
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized." };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: "Unauthorized." };
  }

  const updateData: Partial<Pick<typeof dbUser, "isTwoFactorEnabled">> = {};

  if (values.isTwoFactorEnabled !== undefined) {
    updateData.isTwoFactorEnabled = values.isTwoFactorEnabled;
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

  return { success: "Authentication updated." };
};
