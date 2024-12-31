"use server";

import { getUserById, getUserByUsername } from "@/data/auth/user";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getStartedFormValues } from "@/types/auth.types";
import { getStartedFormSchema } from "@/schemas/auth.schema";

export const updateProfileConfig = async (values: getStartedFormValues) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized." };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: "Unauthorized." };
  }

  const validateFields = getStartedFormSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid fields." };
  }

  const { username, password } = validateFields.data;

  if (username && username !== dbUser.username) {
    const existingUser = await getUserByUsername(username);

    if (existingUser) {
      return { error: "Username already taken." };
    }
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    values.password = hashedPassword;
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

  return { success: "Profile completed." };
};
