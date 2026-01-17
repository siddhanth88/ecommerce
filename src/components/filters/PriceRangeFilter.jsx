import React, { useState, useEffect } from 'react';
import { formatPrice } from '../../utils/formatPrice';

/**
 * Price Range Filter Component
 * @param {Object} props
 * @param {number} props.minPrice - Current minimum price
 * @param {number} props.maxPrice - Current maximum price
 * @param {Function} props.onPriceChange - Price change handler
 * @param {number} props.absoluteMin - Absolute minimum price from all products
 * @param {number} props.absoluteMax - Absolute maximum price from all products
 */
const PriceRangeFilter = ({ 
  minPrice, 
  maxPrice, 
  onPriceChange, 
  absoluteMin = 0, 
  absoluteMax = 1000 
}) => {
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  useEffect(() => {
    setLocalMin(minPrice);
    setLocalMax(maxPrice);
  }, [minPrice, maxPrice]);

  const handleMinChange = (e) => {
    const value = Number(e.target.value);
    setLocalMin(value);
    if (value <= localMax) {
      onPriceChange(value, localMax);
    }
  };

  const handleMaxChange = (e) => {
    const value = Number(e.target.value);
    setLocalMax(value);
    if (value >= localMin) {
      onPriceChange(localMin, value);
    }
  };

  const handleMinInputChange = (e) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= absoluteMin && value <= localMax) {
      setLocalMin(value);
      onPriceChange(value, localMax);
    }
  };

  const handleMaxInputChange = (e) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value <= absoluteMax && value >= localMin) {
      setLocalMax(value);
      onPriceChange(localMin, value);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold tracking-wide">PRICE RANGE</h3>

      {/* Price Inputs */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">Min</label>
          <input
            type="number"
            value={localMin}
            onChange={handleMinInputChange}
            min={absoluteMin}
            max={localMax}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <span className="text-gray-400 mt-5">-</span>
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">Max</label>
          <input
            type="number"
            value={localMax}
            onChange={handleMaxInputChange}
            min={localMin}
            max={absoluteMax}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      {/* Range Sliders */}
      <div className="space-y-2">
        <input
          type="range"
          min={absoluteMin}
          max={absoluteMax}
          value={localMin}
          onChange={handleMinChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
        />
        <input
          type="range"
          min={absoluteMin}
          max={absoluteMax}
          value={localMax}
          onChange={handleMaxChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
        />
      </div>

      {/* Price Display */}
      <div className="text-sm text-gray-600 text-center">
        {formatPrice(localMin)} - {formatPrice(localMax)}
      </div>
    </div>
  );
};

export default PriceRangeFilter;
