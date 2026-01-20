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

  const priceGap = (absoluteMax - absoluteMin) * 0.05; // 5% gap

  const handleMinChange = (e) => {
    const value = Number(e.target.value);
    if (localMax - value >= priceGap) {
      setLocalMin(value);
      onPriceChange(value, localMax);
    }
  };

  const handleMaxChange = (e) => {
    const value = Number(e.target.value);
    if (value - localMin >= priceGap) {
      setLocalMax(value);
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
    <div className="space-y-6">
      <h3 className="text-sm font-bold tracking-wide">PRICE RANGE</h3>

      {/* Price Inputs */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Min</label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">₹</span>
            <input
              type="number"
              value={localMin}
              onChange={handleMinInputChange}
              min={absoluteMin}
              max={localMax}
              className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent transition-all"
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Max</label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">₹</span>
            <input
              type="number"
              value={localMax}
              onChange={handleMaxInputChange}
              min={localMin}
              max={absoluteMax}
              className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Dual Range Slider */}
      <div className="px-1 py-4">
        <div className="range-slider">
          <div
            className="progress"
            style={{
              left: `${((localMin - absoluteMin) / (absoluteMax - absoluteMin)) * 100}%`,
              right: `${100 - ((localMax - absoluteMin) / (absoluteMax - absoluteMin)) * 100}%`
            }}
          ></div>
        </div>
        <div className="range-input">
          <input
            type="range"
            min={absoluteMin}
            max={absoluteMax}
            value={localMin}
            onChange={handleMinChange}
            step="1"
            className="min-range"
          />
          <input
            type="range"
            min={absoluteMin}
            max={absoluteMax}
            value={localMax}
            onChange={handleMaxChange}
            step="1"
            className="max-range"
          />
        </div>
      </div>

      {/* Price Display */}
      <div className="flex justify-between items-center text-xs font-medium text-gray-500 px-1">
        <span>{formatPrice(absoluteMin)}</span>
        <span>{formatPrice(absoluteMax)}</span>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
