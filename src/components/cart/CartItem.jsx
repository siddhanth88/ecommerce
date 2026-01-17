import React from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../contexts/CartContext';

/**
 * Cart Item Component
 * @param {Object} props
 * @param {Object} props.item - Cart item object
 */
const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleDecrease = () => {
    updateQuantity(item.cartItemId, item.quantity - 1);
  };

  const handleIncrease = () => {
    updateQuantity(item.cartItemId, item.quantity + 1);
  };

  const handleRemove = () => {
    removeFromCart(item.cartItemId);
  };

  const getColorName = () => {
    if (item.selectedColor && item.colorNames) {
      const colorIndex = item.colors.indexOf(item.selectedColor);
      return item.colorNames[colorIndex] || item.selectedColor;
    }
    return item.selectedColor;
  };

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100">
      {/* Product Image */}
      <div className="w-20 sm:w-24 h-28 sm:h-32 bg-gray-50 flex-shrink-0">
        <img
          src={item.images[0]}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm sm:text-base truncate">{item.name}</h4>
            <p className="text-gray-500 text-xs sm:text-sm">{item.brand}</p>
          </div>
          <button
            onClick={handleRemove}
            className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
            aria-label="Remove item"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-900" />
          </button>
        </div>

        {/* Size and Color */}
        <div className="flex gap-3 text-xs sm:text-sm text-gray-600 mb-3">
          {item.selectedSize && <span>Size: {item.selectedSize}</span>}
          {item.selectedColor && (
            <span className="flex items-center gap-1">
              Color:
              <span
                className="inline-block w-3 h-3 rounded-full border border-gray-300"
                style={{ backgroundColor: item.selectedColor }}
              />
              {getColorName()}
            </span>
          )}
        </div>

        {/* Quantity and Price */}
        <div className="flex items-center justify-between">
          {/* Quantity Selector */}
          <div className="flex items-center border border-gray-300 rounded">
            <button
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              className="p-1.5 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>

            <span className="px-3 text-sm font-medium min-w-[40px] text-center">
              {item.quantity}
            </span>

            <button
              onClick={handleIncrease}
              disabled={item.quantity >= item.stock}
              className="p-1.5 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="font-medium text-sm sm:text-base">
              {formatPrice(item.price * item.quantity)}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-gray-500">
                {formatPrice(item.price)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
