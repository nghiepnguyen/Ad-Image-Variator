import React, { useRef, useCallback } from 'react';
import type { ImageFile } from '../types';
import { UploadIcon } from './icons/UploadIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ReferenceImageUploaderProps {
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  image: ImageFile | null;
}

export const ReferenceImageUploader: React.FC<ReferenceImageUploaderProps> = ({ onImageSelect, onImageRemove, image }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
    // Reset file input to allow re-uploading the same file after removing it
    if(event.target) {
        event.target.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveClick = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      onImageRemove();
  }, [onImageRemove]);

  return (
    <div className="w-full mt-8">
      <h2 className="text-xl font-semibold mb-3 text-cyan-300">3. Add Reference Image <span className="text-gray-400 text-base font-normal">(Optional)</span></h2>
      <div
        className="relative w-full h-48 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center transition-colors duration-300 bg-gray-800/50"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        {image ? (
          <>
            <img
              src={image.previewUrl}
              alt="Reference preview"
              className="w-full h-full object-contain rounded-lg p-2"
            />
            <button
                onClick={handleRemoveClick}
                className="absolute top-2 right-2 p-2 bg-black/60 rounded-full text-white hover:bg-red-500/90 transition-all"
                aria-label="Remove reference image"
            >
                <TrashIcon className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="text-center text-gray-400 cursor-pointer hover:border-cyan-400 p-4 w-full h-full flex flex-col items-center justify-center" onClick={handleClick}>
            <UploadIcon className="w-10 h-10 mx-auto mb-2" />
            <p>Click to upload a reference</p>
            <p className="text-sm">For style or content inspiration</p>
          </div>
        )}
      </div>
    </div>
  );
};