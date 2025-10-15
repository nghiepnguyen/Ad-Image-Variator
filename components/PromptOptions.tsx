import React from 'react';

interface PromptOptionsProps {
  options: {
    thinBorder: boolean;
    transparentBg: boolean;
    cuteStyle: boolean;
    vectorStyle: boolean;
  };
  onOptionChange: (option: 'thinBorder' | 'transparentBg' | 'cuteStyle' | 'vectorStyle') => void;
}

export const PromptOptions: React.FC<PromptOptionsProps> = ({ options, onOptionChange }) => {
  return (
    <div className="w-full mt-8">
      <h2 className="text-xl font-semibold mb-3 text-cyan-300">2. Prompt Options</h2>
      <div className="space-y-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/60">
        <div className="flex items-center">
          <input
            id="thinBorder"
            type="checkbox"
            checked={options.thinBorder}
            onChange={() => onOptionChange('thinBorder')}
            className="w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-600 focus:ring-offset-gray-800 focus:ring-2"
          />
          <label htmlFor="thinBorder" className="ml-3 text-sm font-medium text-gray-300 cursor-pointer">
            Tạo đường viền mỏng nhẹ <span className="text-gray-400">(adds 'with a thin border around the image')</span>
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="transparentBg"
            type="checkbox"
            checked={options.transparentBg}
            onChange={() => onOptionChange('transparentBg')}
            className="w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-600 focus:ring-offset-gray-800 focus:ring-2"
          />
          <label htmlFor="transparentBg" className="ml-3 text-sm font-medium text-gray-300 cursor-pointer">
            Tách biệt trên nền trong suốt <span className="text-gray-400">(adds 'isolated on transparent background.')</span>
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="cuteStyle"
            type="checkbox"
            checked={options.cuteStyle}
            onChange={() => onOptionChange('cuteStyle')}
            className="w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-600 focus:ring-offset-gray-800 focus:ring-2"
          />
          <label htmlFor="cuteStyle" className="ml-3 text-sm font-medium text-gray-300 cursor-pointer">
            Style cute simple Flat 2D <span className="text-gray-400">(adds 'cute simple Flat 2D style')</span>
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="vectorStyle"
            type="checkbox"
            checked={options.vectorStyle}
            onChange={() => onOptionChange('vectorStyle')}
            className="w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-600 focus:ring-offset-gray-800 focus:ring-2"
          />
          <label htmlFor="vectorStyle" className="ml-3 text-sm font-medium text-gray-300 cursor-pointer">
            Vector in icon style <span className="text-gray-400">(adds 'vector in icon style')</span>
          </label>
        </div>
      </div>
    </div>
  );
};