import React, { useState } from 'react';

/**
 * Color Selector Component - Enhanced for colorVariants structure
 * @param {Object} props
 * @param {Array} props.colorVariants - Array of { name, hexCode, images, isDefault }
 * @param {number} props.selectedColorIndex - Currently selected color index
 * @param {Function} props.onSelectColor - Color selection handler (receives index)
 * @param {boolean} props.error - Error state
 * @param {boolean} props.showPreview - Show image preview on hover
 * 
 * Legacy props for backward compatibility:
 * @param {Array} props.colors - Array of hex codes (legacy)
 * @param {Array} props.colorNames - Array of color names (legacy)
 * @param {string} props.selectedColor - Selected color hex (legacy)
 */
const ColorSelector = ({
  colorVariants = [],
  selectedColorIndex = 0,
  onSelectColor,
  error = false,
  showPreview = false,
  // Legacy props for backward compatibility
  colors = [],
  colorNames = [],
  selectedColor
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Determine if using new colorVariants structure or legacy
  const isLegacyMode = colorVariants.length === 0 && colors.length > 0;

  // Normalize to colorVariants format
  const normalizedVariants = isLegacyMode
    ? colors.map((hex, idx) => ({
      name: colorNames[idx] || hex,
      hexCode: hex,
      images: [],
      isDefault: idx === 0
    }))
    : colorVariants;

  // Determine selected index
  const effectiveSelectedIndex = isLegacyMode
    ? colors.findIndex(c => c === selectedColor) || 0
    : selectedColorIndex;

  const handleSelect = (index) => {
    if (onSelectColor) {
      onSelectColor(index);
    }
  };

  if (normalizedVariants.length === 0) return null;

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium flex items-center gap-2">
        Color
        {normalizedVariants[effectiveSelectedIndex] && (
          <span className="text-gray-500 font-normal">
            — {normalizedVariants[effectiveSelectedIndex].name}
          </span>
        )}
        {error && <span className="text-red-500">*</span>}
      </label>

      <div className="flex flex-wrap gap-3 relative">
        {normalizedVariants.map((variant, index) => {
          const isSelected = effectiveSelectedIndex === index;
          const isHovered = hoveredIndex === index;

          return (
            <div key={`${variant.hexCode}-${index}`} className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleSelect(index);
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`w-10 h-10 rounded-full border-2 transition-all relative group ${isSelected
                  ? 'border-black scale-110 ring-2 ring-black ring-offset-2'
                  : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                  } ${error && effectiveSelectedIndex === null ? 'ring-2 ring-red-500' : ''}`}
                style={{ backgroundColor: variant.hexCode }}
                title={variant.name}
                aria-label={`Select ${variant.name} color`}
              >
                {/* Checkmark for selected */}
                {isSelected && (
                  <svg
                    className="w-5 h-5 absolute inset-0 m-auto pointer-events-none"
                    fill={variant.hexCode === '#FFFFFF' || variant.hexCode === '#ffffff' || variant.hexCode.toLowerCase() === '#fff' ? '#000' : '#fff'}
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
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {variant.name}
                </span>
              </button>

              {/* Image preview on hover */}
              {showPreview && isHovered && variant.images?.[0] && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none">
                  <div className="w-24 h-24 rounded-lg overflow-hidden shadow-xl border border-gray-200 bg-white">
                    <img
                      src={variant.images[0]}
                      alt={variant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-b border-r border-gray-200 rotate-45"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && effectiveSelectedIndex === null && (
        <p className="text-xs text-red-500">Please select a color</p>
      )}
    </div>
  );
};

export default ColorSelector;
