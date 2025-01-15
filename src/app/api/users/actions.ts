'use server';

import { revalidatePath } from "next/cache";
import prisma from "@/utils/prisma";
import { getUser } from "@/utils/getUser";
import { createClient } from "@/utils/supabase/server";

async function deleteOldProfileImage(url: string) {
  try {
    const supabase = await createClient();
    const filename = url.split('/').pop();
    if (!filename) return;

    await supabase.storage
      .from('profile-images')
      .remove([filename]);
  } catch (error) {
    console.error('Error deleting old profile image:', error);
  }
}

export async function uploadProfileImage(file: File, oldImageUrl: string | null) {
  const supabase = await createClient();
  const { user: authUser } = await getUser();
  
  if (!authUser) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { email: authUser.email! }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('profile-images')
    .upload(fileName, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('profile-images')
    .getPublicUrl(fileName);

  // Delete old image if it exists
  if (oldImageUrl) {
    await deleteOldProfileImage(oldImageUrl);
  }

  // Update user profile
  await prisma.user.update({
    where: { id: user.id },
    data: { profileImage: publicUrl },
  });

  revalidatePath("/dashboard/settings");
  return publicUrl;
}

export async function updateUserProfile(formData: FormData) {
  const { user: authUser } = await getUser();
  if (!authUser) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { email: authUser.email! }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const phone = formData.get("phone") as string;
  const occupation = formData.get("occupation") as string;

  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      firstName,
      lastName,
      phone: phone || null,
      occupation: occupation || null,
    },
  });

  revalidatePath("/dashboard/settings");
} 