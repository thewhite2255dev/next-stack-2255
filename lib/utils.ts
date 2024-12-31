import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { prisma } from "./prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCloudinaryPublicId(url: string): string | null {
  if (!url.startsWith("https://res.cloudinary.com/")) {
    return null;
  }

  return (
    url
      .split("/")
      .pop()
      ?.replace(/\.[^/.]+$/, "") || null
  );
}

export async function generateUniqueUsername(
  base: string,
  maxLength: number = 15,
): Promise<string> {
  const cleanedBase = base
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();

  const timestamp = Date.now().toString(36).slice(-4);
  const randomPart = Math.random().toString(36).slice(-4);
  let username = `${cleanedBase}${timestamp}${randomPart}`;

  if (username.length > maxLength) {
    const excessLength = username.length - maxLength;
    username = `${cleanedBase.slice(0, cleanedBase.length - excessLength)}${timestamp}${randomPart}`;
  }

  let isUnique = false;
  let attempt = 0;

  while (!isUnique) {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    if (!existingUser) {
      isUnique = true;
    } else {
      attempt++;
      username = `${cleanedBase.slice(0, cleanedBase.length - 1)}${attempt}`;
    }
  }

  return username;
}
