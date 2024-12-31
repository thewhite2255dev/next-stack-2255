"use server";

import { prisma } from "@/lib/prisma";
import { getUserById } from "@/data/auth/user";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary-config";
import { getCloudinaryPublicId } from "@/lib/utils";

export const deleteAvatar = async () => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized." };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: "Unauthorized." };
  }

  try {
    const publicId = getCloudinaryPublicId(dbUser.image || "");

    if (publicId) {
      await cloudinary.api.delete_resources([publicId], {
        type: "upload",
        resource_type: "image",
      });
    }

    await prisma.user.update({
      where: { id: dbUser.id },
      data: { image: null },
    });

    revalidatePath("/");

    return { success: "Avatar deleted." };
  } catch (error) {
    return { error: "Something went wrong." };
  }
};
