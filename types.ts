
export interface GeneratedImage {
  prompt: string;
  imageUrl: string;
  text?: string | null;
}

export interface ImageFile {
  file: File;
  previewUrl: string;
}
