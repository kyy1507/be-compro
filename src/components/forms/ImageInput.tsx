"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ImageInputProps {
  id: string;
  label: string;
  defaultImage?: string;
  disabled?: boolean;
  onChange?: (file: File | null) => void;
}

export default function ImageInput({
  id,
  label,
  defaultImage,
  disabled,
  onChange,
}: ImageInputProps) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null);

  useEffect(() => {
    if (defaultImage) {
      setPreview(defaultImage);
    }
  }, [defaultImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    onChange?.(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
      />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-24 h-24 object-cover rounded-md border mt-2"
        />
      )}
    </div>
  );
}
