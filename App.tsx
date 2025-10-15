import React, { useState, useCallback } from 'react';
import type { ImageFile, GeneratedImage } from './types';
import { generateImageVariations } from './services/geminiService';
import { ImageUploader } from './components/ImageUploader';
import { ReferenceImageUploader } from './components/ReferenceImageUploader';
import { PromptManager } from './components/PromptManager';
import { ResultsDisplay } from './components/ResultsDisplay';
import { FullscreenViewer } from './components/FullscreenViewer';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { PromptOptions } from './components/PromptOptions';

const dataURLtoFile = (dataurl: string, filename: string): File | null => {
    const arr = dataurl.split(',');
    if (arr.length < 2) return null;
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};


const App: React.FC = () => {
  const [image, setImage] = useState<ImageFile | null>(null);
  const [referenceImages, setReferenceImages] = useState<ImageFile[]>([]);
  const [prompts, setPrompts] = useState<string[]>(['']);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<GeneratedImage | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [promptOptions, setPromptOptions] = useState({
    thinBorder: false,
    transparentBg: false,
    cuteStyle: false,
    vectorStyle: false,
  });

  const PROMPT_OPTIONS_MAP = {
    thinBorder: ', with a thin border around the image',
    transparentBg: ', isolated on transparent background.',
    cuteStyle: ', cute simple Flat 2D style',
    vectorStyle: ', vector in icon style',
  };

  const handleOptionChange = (option: keyof typeof promptOptions) => {
    setPromptOptions(prevOptions => ({
      ...prevOptions,
      [option]: !prevOptions[option],
    }));
  };

  const handleImageSelect = useCallback((file: File) => {
    setImage({
      file,
      previewUrl: URL.createObjectURL(file),
    });
    setGeneratedImages([]);
    setError(null);
  }, []);
  
  const handleImageRemove = useCallback(() => {
    if (image) {
      URL.revokeObjectURL(image.previewUrl);
      setImage(null);
    }
    // Also clear reference images as they depend on the main image
    referenceImages.forEach(refImg => URL.revokeObjectURL(refImg.previewUrl));
    setReferenceImages([]);
    setGeneratedImages([]); // And clear results
    setError(null);
  }, [image, referenceImages]);

  const handleAddReferenceImage = useCallback((file: File) => {
    setReferenceImages(prev => [...prev, {
      file,
      previewUrl: URL.createObjectURL(file),
    }]);
  }, []);

  const handleRemoveReferenceImage = useCallback((indexToRemove: number) => {
    setReferenceImages(prev => {
        const imageToRemove = prev[indexToRemove];
        if (imageToRemove) {
            URL.revokeObjectURL(imageToRemove.previewUrl);
        }
        return prev.filter((_, index) => index !== indexToRemove);
    });
  }, []);


  const handleGenerateClick = async () => {
    const activePrompts = prompts.filter(p => p.trim() !== '');
    if (activePrompts.length === 0) {
      setError('Please provide at least one prompt.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    const finalPrompts = activePrompts.map(prompt => {
      let finalPrompt = prompt.trim();
      if (promptOptions.thinBorder) {
          finalPrompt += PROMPT_OPTIONS_MAP.thinBorder;
      }
      if (promptOptions.transparentBg) {
          finalPrompt += PROMPT_OPTIONS_MAP.transparentBg;
      }
      if (promptOptions.cuteStyle) {
          finalPrompt += PROMPT_OPTIONS_MAP.cuteStyle;
      }
      if (promptOptions.vectorStyle) {
          finalPrompt += PROMPT_OPTIONS_MAP.vectorStyle;
      }
      return finalPrompt;
    });

    try {
      const results = await generateImageVariations(
        image?.file ?? null,
        finalPrompts,
        referenceImages.map(img => img.file),
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
  
  const handleUseImageAsInput = useCallback(async (generatedImage: GeneratedImage) => {
    const newFileName = `generated_${generatedImage.prompt.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 20)}.png`;
    const file = dataURLtoFile(generatedImage.imageUrl, newFileName);

    if (!file) {
      setError("Could not use this image as input.");
      return;
    }
    
    // Clean up old object URLs
    if (image) {
      URL.revokeObjectURL(image.previewUrl);
    }
    referenceImages.forEach(refImg => URL.revokeObjectURL(refImg.previewUrl));

    // Set new image
    setImage({
      file,
      previewUrl: URL.createObjectURL(file),
    });

    // Reset other states
    setGeneratedImages([]);
    setReferenceImages([]);
    setError(null);
    
    // Scroll to top to see the new input image
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [image, referenceImages]);

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
              <PromptOptions options={promptOptions} onOptionChange={handleOptionChange} />
              <ImageUploader onImageSelect={handleImageSelect} image={image} onImageRemove={handleImageRemove} />
              {image && (
                  <ReferenceImageUploader 
                  onImageAdd={handleAddReferenceImage}
                  onImageRemove={handleRemoveReferenceImage}
                  images={referenceImages}
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
                  onUseAsInput={handleUseImageAsInput}
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