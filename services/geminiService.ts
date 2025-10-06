import { GoogleGenAI, Modality } from "@google/genai";
import type { GeneratedImage } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

export const generateImageVariations = async (
  imageFile: File | null,
  prompts: string[],
  referenceImageFiles: File[],
  aspectRatio: string
): Promise<GeneratedImage[]> => {
  // Text-to-Image generation if no main image is provided
  if (!imageFile) {
    const generationPromises = prompts.map(async (prompt) => {
      try {
        const response = await ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: prompt,
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: aspectRatio,
          },
        });

        if (!response.generatedImages || response.generatedImages.length === 0) {
            throw new Error('API did not return any images.');
        }

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

        return { prompt, imageUrl, text: null };

      } catch (error) {
        console.error(`Error generating image for prompt "${prompt}":`, error);
        return {
          prompt,
          imageUrl: 'error',
          text: error instanceof Error ? error.message : 'An unknown error occurred.',
        };
      }
    });
    return Promise.all(generationPromises);
  }

  // Existing logic for Image-to-Image variations
  const base64ImageData = await fileToBase64(imageFile);
  const mimeType = imageFile.type;

  const generationPromises = prompts.map(async (prompt) => {
    try {
      const imageParts = [
        {
          inlineData: {
            data: base64ImageData,
            mimeType: mimeType,
          },
        },
      ];

      if (referenceImageFiles && referenceImageFiles.length > 0) {
        const referenceImagePromises = referenceImageFiles.map(async (file) => {
          const base64Data = await fileToBase64(file);
          return {
            inlineData: {
              data: base64Data,
              mimeType: file.type,
            },
          };
        });
        const referenceImageParts = await Promise.all(referenceImagePromises);
        imageParts.push(...referenceImageParts);
      }


      const parts = [...imageParts, { text: prompt }];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: parts,
        },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
      });

      let imageUrl = '';
      let text: string | null = null;
      
      if (response.candidates && response.candidates[0].content.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              const base64ImageBytes = part.inlineData.data;
              imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            } else if (part.text) {
              text = part.text;
            }
          }
      }

      if (!imageUrl) {
          throw new Error('No image was generated for the prompt.');
      }

      return { prompt, imageUrl, text };

    } catch (error) {
      console.error(`Error generating variation for prompt "${prompt}":`, error);
      return {
        prompt,
        imageUrl: 'error',
        text: error instanceof Error ? error.message : 'An unknown error occurred.',
      };
    }
  });

  return Promise.all(generationPromises);
};