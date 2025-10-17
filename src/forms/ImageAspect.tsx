

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type Props = {
  onChange: (file: File | null) => void;
  value?: File | null; 
  existingImageUrl?: string; 
};

const ImageAspect = ({ onChange, value, existingImageUrl }: Props) => {
  const [preview, setPreview] = useState<string | null>(existingImageUrl || null);

  useEffect(() => {
    if (value) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(value);
    } else if (!value && existingImageUrl) {
      setPreview(existingImageUrl);
    } else {
      setPreview(null);
    }
  }, [value, existingImageUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  return (
    <div className="space-y-3">
      <Input
        type="file"
        accept="image/*"
        className="bg-white"
        onChange={handleChange}
      />
      {preview && (
        <AspectRatio ratio={16 / 9} className="bg-muted rounded-md overflow-hidden">
          <img
            src={preview}
            alt="Vista previa"
            className="object-cover w-full h-full"
          />
        </AspectRatio>
      )}
    </div>
  );
};

export default ImageAspect;

