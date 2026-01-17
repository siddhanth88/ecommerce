import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../contexts/CartContext';

/**
 * Product Card Component
 * @param {Object} props
 * @param {Object} props.product - Product object
 * @param {boolean} props.isFavorite - Is product favorited
 * @param {Function} props.onToggleFavorite - Toggle favorite handler
 */
const ProductCard = ({ product, isFavorite = false, onToggleFavorite }) => {
  const { addToCart } = useCart();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // For products with only one size/color, add directly
    const defaultSize = product.sizes.length === 1 ? product.sizes[0] : null;
    const defaultColor = product.colors.length === 1 ? product.colors[0] : null;
    
    if (product.sizes.length > 1 || product.colors.length > 1) {
      // Navigate to product detail for selection
      window.location.href = `/product/${product.id}`;
    } else {
      addToCart(product, defaultSize, defaultColor);
    }
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative">
        {/* Product Image */}
        <div className="overflow-hidden bg-gray-50 aspect-[3/4] mb-3 relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />

          {/* Discount Badge */}
          {product.discount > 0 && (
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
              <span className="bg-red-500 text-white px-2 py-1 text-[10px] sm:text-xs font-medium">
                -{product.discount}%
              </span>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && !product.discount && (
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
              {product.tags.slice(0, 1).map((tag) => (
                <span
                  key={tag}
                  className="bg-white text-black px-2 py-1 text-[10px] sm:text-xs font-medium block mb-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Quick Add Button */}
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleQuickAdd}
              className="w-full py-2 sm:py-2.5 bg-white text-black text-xs sm:text-sm font-medium tracking-wide hover:bg-gray-100 transition-colors"
            >
              {product.sizes.length > 1 || product.colors.length > 1 ? 'SELECT OPTIONS' : 'ADD TO CART'}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm sm:text-base truncate">{product.name}</h3>
            <p className="text-gray-500 text-xs sm:text-sm">{product.brand}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-black font-medium text-sm sm:text-base">
                {formatPrice(product.price)}
              </p>
              {product.originalPrice && (
                <p className="text-gray-400 line-through text-xs sm:text-sm">
                  {formatPrice(product.originalPrice)}
                </p>
              )}
            </div>
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className="p-1.5 hover:bg-gray-100 rounded-full flex-shrink-0"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`}
            />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
