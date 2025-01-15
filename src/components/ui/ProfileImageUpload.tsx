'use client';

import { useState } from "react";
import Image from "next/image";
import ImageUpload from "./ImageUpload";
import { uploadProfileImage } from "@/app/api/users/actions";

interface Props {
  profileImage: string | null;
}

export default function ProfileImageUpload({ profileImage: initialImage }: Props) {
  const [currentImage, setCurrentImage] = useState(initialImage);

  const handleFileSelected = async (file: File) => {
    const newImageUrl = await uploadProfileImage(file, currentImage);
    setCurrentImage(newImageUrl);
  };

  return (
    <div className="col-span-full">
      <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
        Photo
      </label>
      <div className="mt-2 flex items-center gap-x-3">
        <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
          {currentImage ? (
            <Image src={currentImage} alt="Profile" width={48} height={48} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gray-200" />
          )}
        </div>
        <ImageUpload onFileSelected={handleFileSelected} />
      </div>
    </div>
  );
} 