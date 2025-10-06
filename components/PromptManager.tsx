import React from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface PromptManagerProps {
  prompts: string[];
  setPrompts: React.Dispatch<React.SetStateAction<string[]>>;
  hasImage: boolean;
}

export const PromptManager: React.FC<PromptManagerProps> = ({ prompts, setPrompts, hasImage }) => {
  const addPrompt = () => {
    setPrompts([...prompts, '']);
  };

  const removePrompt = (index: number) => {
    setPrompts(prompts.filter((_, i) => i !== index));
  };

  const updatePrompt = (index: number, value: string) => {
    const newPrompts = [...prompts];
    newPrompts[index] = value;
    setPrompts(newPrompts);
  };

  const placeholderText = hasImage 
    ? "e.g., Make the background a cityscape"
    : "e.g., A photorealistic cat wearing a tiny hat";

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-3 text-cyan-300">1. Add Generation Prompts</h2>
      <div className="space-y-3">
        {prompts.map((prompt, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => updatePrompt(index, e.target.value)}
              placeholder={placeholderText}
              className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
            />
            <button
              onClick={() => removePrompt(index)}
              className="p-2 rounded-md bg-red-600/80 hover:bg-red-500 transition-colors"
              aria-label="Remove prompt"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addPrompt}
        className="mt-4 flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
      >
        <PlusIcon className="w-5 h-5" />
        <span>Add Prompt</span>
      </button>
    </div>
  );
};