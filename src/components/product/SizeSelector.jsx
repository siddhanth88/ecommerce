import React from 'react';

/**
 * Size Selector Component
 * @param {Object} props
 * @param {Array} props.sizes - Available sizes
 * @param {string} props.selectedSize - Currently selected size
 * @param {Function} props.onSelectSize - Size selection handler
 * @param {number} props.stock - Available stock
 * @param {boolean} props.error - Error state
 */
const SizeSelector = ({ sizes, selectedSize, onSelectSize, stock = 100, error = false }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          Size {error && <span className="text-red-500">*</span>}
        </label>
        {selectedSize && (
          <span className="text-xs text-gray-500">
            {stock > 0 ? `${stock} in stock` : 'Out of stock'}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          const isAvailable = stock > 0; // In real app, check stock per size

          return (
            <button
              key={size}
              onClick={() => isAvailable && onSelectSize(size)}
              disabled={!isAvailable}
              className={`min-w-[60px] px-4 py-2.5 text-sm font-medium border transition-all ${
                isSelected
                  ? 'border-black bg-black text-white'
                  : isAvailable
                  ? 'border-gray-300 hover:border-black'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed line-through'
              } ${error && !selectedSize ? 'border-red-500' : ''}`}
            >
              {size}
            </button>
          );
        })}
      </div>

      {error && !selectedSize && (
        <p className="text-xs text-red-500">Please select a size</p>
      )}
    </div>
  );
};

export default SizeSelector;
