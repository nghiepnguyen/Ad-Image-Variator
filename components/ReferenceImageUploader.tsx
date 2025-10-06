import React, { useRef } from 'react';
import type { ImageFile } from '../types';
import { UploadIcon } from './icons/UploadIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ReferenceImageUploaderProps {
  onImageAdd: (file: File) => void;
  onImageRemove: (index: number) => void;
  images: ImageFile[];
}

export const ReferenceImageUploader: React.FC<ReferenceImageUploaderProps> = ({ onImageAdd, onImageRemove, images }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
        for (const file of Array.from(files)) {
            onImageAdd(file);
        }
    }
    if(event.target) {
        event.target.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full mt-8">
      <h2 className="text-xl font-semibold mb-3 text-cyan-300">3. Add Reference Image(s) <span className="text-gray-400 text-base font-normal">(Optional)</span></h2>
      <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/60">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {images.map((image, index) => (
                <div key={`${image.file.name}-${index}`} className="relative group aspect-square">
                <img
                    src={image.previewUrl}
                    alt={`Reference ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                />
                <button
                    onClick={() => onImageRemove(index)}
                    className="absolute top-1 right-1 p-1 bg-black/70 rounded-full text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Remove reference image"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
                </div>
            ))}
             <button
                onClick={handleClick}
                className="aspect-square border-2 border-dashed border-gray-600 rounded-md flex flex-col items-center justify-center text-gray-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                aria-label="Add reference images"
            >
                <UploadIcon className="w-8 h-8" />
                <span className="text-xs mt-1 font-medium">Add More</span>
            </button>
        </div>
      </div>
       <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          multiple
        />
    </div>
  );
};