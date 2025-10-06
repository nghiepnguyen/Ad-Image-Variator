import React from 'react';

interface AspectRatioSelectorProps {
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
  isDisabled: boolean;
  hasImage: boolean;
}

const aspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"];

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ aspectRatio, setAspectRatio, isDisabled, hasImage }) => {
  return (
    <div className="w-full mt-8">
      <h2 className="text-xl font-semibold mb-1 text-cyan-300">{hasImage ? '4. Aspect Ratio' : '3. Aspect Ratio'}</h2>
      {isDisabled && (
          <p className="text-sm text-gray-400 mb-3">Locked to match uploaded image dimensions.</p>
      )}
      <div className="relative">
        <select
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value)}
          disabled={isDisabled}
          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all appearance-none disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
          aria-label="Select aspect ratio"
        >
          {aspectRatios.map(ratio => (
            <option key={ratio} value={ratio}>{ratio}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  );
};