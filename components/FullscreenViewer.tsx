import React, { useEffect } from 'react';
import type { GeneratedImage } from '../types';

interface FullscreenViewerProps {
  image: GeneratedImage;
  onClose: () => void;
}

export const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ image, onClose }) => {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="fullscreen-prompt"
    >
      <div
        className="relative bg-gray-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-700">
            <h2 id="fullscreen-prompt" className="text-lg font-semibold text-cyan-300 truncate">{image.prompt}</h2>
        </div>
        <div className="flex-1 p-4 overflow-hidden flex items-center justify-center">
            <img
                src={image.imageUrl}
                alt={image.prompt}
                className="max-w-full max-h-full object-contain"
            />
        </div>
        {image.text && (
            <div className="p-4 border-t border-gray-700">
                <p className="text-sm text-gray-300 italic">"{image.text}"</p>
            </div>
        )}
         <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 bg-gray-800/80 rounded-full text-gray-300 hover:text-white hover:bg-red-600 transition-colors"
          aria-label="Close fullscreen view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};
