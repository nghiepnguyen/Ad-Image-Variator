import React, { useState, useCallback } from 'react';
import type { ImageFile, GeneratedImage } from './types';
import { generateImageVariations } from './services/geminiService';
import { ImageUploader } from './components/ImageUploader';
import { ReferenceImageUploader } from './components/ReferenceImageUploader';
import { PromptManager } from './components/PromptManager';
import { ResultsDisplay } from './components/ResultsDisplay';
import { FullscreenViewer } from './components/FullscreenViewer';
import { AspectRatioSelector } from './components/AspectRatioSelector';

const App: React.FC = () => {
  const [image, setImage] = useState<ImageFile | null>(null);
  const [referenceImage, setReferenceImage] = useState<ImageFile | null>(null);
  const [prompts, setPrompts] = useState<string[]>(['']);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<GeneratedImage | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');

  const handleImageSelect = useCallback((file: File) => {
    setImage({
      file,
      previewUrl: URL.createObjectURL(file),
    });
    setGeneratedImages([]);
    setError(null);
  }, []);

  const handleReferenceImageSelect = useCallback((file: File) => {
    setReferenceImage({
      file,
      previewUrl: URL.createObjectURL(file),
    });
  }, []);

  const handleReferenceImageRemove = useCallback(() => {
    if (referenceImage) {
      URL.revokeObjectURL(referenceImage.previewUrl);
    }
    setReferenceImage(null);
  }, [referenceImage]);


  const handleGenerateClick = async () => {
    if (prompts.every(p => p.trim() === '')) {
      setError('Please provide at least one prompt.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const results = await generateImageVariations(
        image?.file ?? null,
        prompts.filter(p => p.trim() !== ''),
        referenceImage?.file ?? null,
        aspectRatio
      );
      setGeneratedImages(results);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during generation.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const canGenerate = prompts.some(p => p.trim() !== '') && !isLoading;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-500">
              Ad Image Variator
            </h1>
            <p className="mt-2 text-lg text-gray-400">
              Generate creative variations of your social media ads with AI.
            </p>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col p-6 bg-gray-800/50 rounded-xl border border-gray-700 shadow-2xl">
              <PromptManager prompts={prompts} setPrompts={setPrompts} hasImage={!!image} />
              <ImageUploader onImageSelect={handleImageSelect} image={image} />
              {image && (
                  <ReferenceImageUploader 
                  onImageSelect={handleReferenceImageSelect}
                  onImageRemove={handleReferenceImageRemove}
                  image={referenceImage}
                  />
              )}
              <AspectRatioSelector 
                  aspectRatio={aspectRatio}
                  setAspectRatio={setAspectRatio}
                  isDisabled={!!image}
                  hasImage={!!image}
              />
              <div className="mt-auto pt-8">
                  <button
                      onClick={handleGenerateClick}
                      disabled={!canGenerate}
                      className={`w-full text-lg font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center ${
                          canGenerate
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg transform hover:scale-105'
                          : 'bg-gray-600 cursor-not-allowed text-gray-400'
                      }`}
                  >
                      {isLoading ? (
                          <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Generating...
                          </>
                      ) : 'Generate Images'}
                  </button>
                  {error && <p className="text-red-400 text-center mt-4">{error}</p>}
              </div>
            </div>

            <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 shadow-2xl min-h-[60vh] lg:min-h-0">
              <h2 className="text-2xl font-semibold mb-4 text-cyan-300">Results</h2>
              <ResultsDisplay 
                  originalImage={image} 
                  generatedImages={generatedImages}
                  isLoading={isLoading}
                  onImageSelect={setFullscreenImage}
              />
            </div>
          </main>
        </div>
      </div>
      {fullscreenImage && (
        <FullscreenViewer 
            image={fullscreenImage} 
            onClose={() => setFullscreenImage(null)} 
        />
      )}
    </>
  );
};

export default App;