import React from 'react';

/**
 * Color Selector Component
 * @param {Object} props
 * @param {Array} props.colors - Available colors (hex codes)
 * @param {Array} props.colorNames - Color names for tooltips
 * @param {string} props.selectedColor - Currently selected color
 * @param {Function} props.onSelectColor - Color selection handler
 * @param {boolean} props.error - Error state
 */
const ColorSelector = ({ 
  colors, 
  colorNames = [], 
  selectedColor, 
  onSelectColor,
  error = false 
}) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">
        Color {error && <span className="text-red-500">*</span>}
        {selectedColor && colorNames.length > 0 && (
          <span className="ml-2 text-gray-500 font-normal">
            - {colorNames[colors.indexOf(selectedColor)]}
          </span>
        )}
      </label>

      <div className="flex flex-wrap gap-3">
        {colors.map((color, index) => {
          const isSelected = selectedColor === color;
          const colorName = colorNames[index] || color;

          return (
            <button
              key={color}
              onClick={() => onSelectColor(color)}
              className={`w-10 h-10 rounded-full border-2 transition-all relative group ${
                isSelected ? 'border-black scale-110' : 'border-gray-300 hover:border-gray-400'
              } ${error && !selectedColor ? 'ring-2 ring-red-500' : ''}`}
              style={{ backgroundColor: color }}
              title={colorName}
              aria-label={`Select ${colorName} color`}
            >
              {/* Checkmark for selected */}
              {isSelected && (
                <svg
                  className="w-5 h-5 absolute inset-0 m-auto"
                  fill={color === '#FFFFFF' || color === '#ffffff' ? '#000' : '#fff'}
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}

              {/* Tooltip */}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {colorName}
              </span>
            </button>
          );
        })}
      </div>

      {error && !selectedColor && (
        <p className="text-xs text-red-500">Please select a color</p>
      )}
    </div>
  );
};

export default ColorSelector;
