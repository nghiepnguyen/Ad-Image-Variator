import React, { useRef } from 'react';
import type { ImageFile } from '../types';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  image: ImageFile | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, image }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full mt-8">
      <h2 className="text-xl font-semibold mb-3 text-cyan-300">2. Start with an Image <span className="text-gray-400 text-base font-normal">(Optional)</span></h2>
      <div
        className="relative w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-cyan-400 transition-colors duration-300 bg-gray-800/50"
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        {image ? (
          <img
            src={image.previewUrl}
            alt="Ad preview"
            className="w-full h-full object-contain rounded-lg p-2"
          />
        ) : (
          <div className="text-center text-gray-400">
            <UploadIcon className="w-12 h-12 mx-auto mb-2" />
            <p>Click to upload an image</p>
            <p className="text-sm">PNG, JPG, or WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
};