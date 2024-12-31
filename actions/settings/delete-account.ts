"use server";

import { prisma } from "@/lib/prisma";
import { getUserById } from "@/data/auth/user";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary-config";
import bcrypt from "bcryptjs";
import { DeleteAccountFormValues } from "@/types/settings.types";
import { DeleteAccountSchema } from "@/schemas/settings.schema";
import { getCloudinaryPublicId } from "@/lib/utils";

export const deleteAccount = async (values: DeleteAccountFormValues) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized." };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: "Unauthorized." };
  }

  const validateFields = DeleteAccountSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid fields." };
  }

  const { email, password } = validateFields.data;

  if (email && email !== dbUser.email) {
    return { error: "Incorrect email." };
  }

  if (password && dbUser.password) {
    const isPasswordMatch = await bcrypt.compare(password, dbUser.password);

    if (!isPasswordMatch) {
      return { error: "Incorrect password." };
    }
  }

  try {
    const publicId = getCloudinaryPublicId(dbUser.image || "");

    if (publicId) {
      await cloudinary.api.delete_resources([publicId], {
        type: "upload",
        resource_type: "image",
      });
    }

    await prisma.user.delete({
      where: {
        email,
      },
    });

    revalidatePath("/");

    return { success: "Account deleted." };
  } catch (error) {
    return { error: "Something went wrong." };
  }
};
