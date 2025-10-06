
import React from 'react';
import type { ImageFile, GeneratedImage } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { ExpandIcon } from './icons/ExpandIcon';

interface ResultsDisplayProps {
  originalImage: ImageFile | null;
  generatedImages: GeneratedImage[];
  isLoading: boolean;
  onImageSelect: (image: GeneratedImage) => void;
}

interface ImageCardProps {
    title: string;
    imageUrl: string;
    caption?: string | null;
    isError?: boolean;
    onDownload?: () => void;
    onQuickView?: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ title, imageUrl, caption, isError = false, onDownload, onQuickView }) => (
  <div className="group bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 transform hover:scale-105 transition-transform duration-300">
    <div className="p-3">
      <h3 className="font-semibold text-cyan-400 truncate">{title}</h3>
    </div>
    <div className={`relative aspect-square ${isError ? 'bg-red-900/50 flex items-center justify-center' : 'bg-black'}`}>
      {isError ? (
         <div className="text-center p-4 text-red-300">
            <p className="font-bold">Generation Failed</p>
            <p className="text-xs mt-2">{caption}</p>
         </div>
      ) : (
        <>
            <img src={imageUrl} alt={title} className="w-full h-full object-contain" />
            <div className="absolute top-2 right-2 flex space-x-2">
                 {onQuickView && (
                    <button
                        onClick={onQuickView}
                        className="p-2 bg-black/60 rounded-full text-white hover:bg-cyan-500/90 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label="Quick view image"
                    >
                        <ExpandIcon className="w-5 h-5" />
                    </button>
                )}
                {onDownload && (
                    <button
                        onClick={onDownload}
                        className="p-2 bg-black/60 rounded-full text-white hover:bg-cyan-500/90 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label="Download image"
                    >
                        <DownloadIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
        </>
      )}
    </div>
    {caption && !isError && (
      <div className="p-3 bg-gray-800/50">
        <p className="text-sm text-gray-300 italic">"{caption}"</p>
      </div>
    )}
  </div>
);


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ originalImage, generatedImages, isLoading, onImageSelect }) => {
    const handleDownload = (imageUrl: string, prompt: string) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        const sanitizedPrompt = prompt.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        link.download = `variation_${sanitizedPrompt.slice(0, 50)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!originalImage && !isLoading && generatedImages.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-800/30 rounded-lg">
                <p>Generate images from prompts to see results here.</p>
            </div>
        );
    }
    
    if (isLoading && generatedImages.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-800/30 rounded-lg">
                <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-lg">Generating images...</p>
                <p className="text-sm">This can take a moment.</p>
            </div>
        );
    }

  return (
    <div className="w-full h-full overflow-y-auto pr-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {originalImage && (
          <ImageCard title="Original Image" imageUrl={originalImage.previewUrl} />
        )}
        {generatedImages.map((image, index) => (
          <ImageCard 
            key={index} 
            title={image.prompt} 
            imageUrl={image.imageUrl} 
            caption={image.text}
            isError={image.imageUrl === 'error'}
            onDownload={image.imageUrl !== 'error' ? () => handleDownload(image.imageUrl, image.prompt) : undefined}
            onQuickView={image.imageUrl !== 'error' ? () => onImageSelect(image) : undefined}
          />
        ))}
      </div>
    </div>
  );
};
