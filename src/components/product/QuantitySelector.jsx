import React from 'react';
import { Minus, Plus } from 'lucide-react';

/**
 * Quantity Selector Component
 * @param {Object} props
 * @param {number} props.quantity - Current quantity
 * @param {Function} props.onQuantityChange - Quantity change handler
 * @param {number} props.min - Minimum quantity (default: 1)
 * @param {number} props.max - Maximum quantity (default: stock or 99)
 * @param {number} props.stock - Available stock
 */
const QuantitySelector = ({ 
  quantity, 
  onQuantityChange, 
  min = 1, 
  max = 99,
  stock = 99 
}) => {
  const maxQuantity = Math.min(max, stock);

  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= min && value <= maxQuantity) {
      onQuantityChange(value);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Quantity</label>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-gray-300 rounded">
          <button
            onClick={handleDecrease}
            disabled={quantity <= min}
            className="p-2 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>

          <input
            type="number"
            value={quantity}
            onChange={handleInputChange}
            min={min}
            max={maxQuantity}
            className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
            aria-label="Quantity"
          />

          <button
            onClick={handleIncrease}
            disabled={quantity >= maxQuantity}
            className="p-2 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {stock < 10 && stock > 0 && (
          <span className="text-xs text-orange-600">
            Only {stock} left in stock
          </span>
        )}

        {stock === 0 && (
          <span className="text-xs text-red-600">Out of stock</span>
        )}
      </div>
    </div>
  );
};

export default QuantitySelector;
