import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';

/**
 * Product Card Component
 * @param {Object} props
 * @param {Object} props.product - Product object
 * @param {boolean} props.isFavorite - Is product favorited
 * @param {Function} props.onToggleFavorite - Toggle favorite handler
 */
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isFavorite = isInWishlist(product._id);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // For products with only one size/color, add directly
    const defaultSize = product.sizes?.length === 1 ? product.sizes[0] : null;
    const defaultColor = product.colors?.length === 1 ? product.colors[0] : null;

    if ((product.sizes?.length > 1) || (product.colors?.length > 1)) {
      // Navigate to product detail for selection
      navigate(`/product/${product._id}`);
    } else {
      addToCart(product, defaultSize, defaultColor);
    }
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  return (
    <div className="group block">
      <div className="relative">
        {/* Product Image */}
        <div className="overflow-hidden bg-gray-50 aspect-[3/4] mb-3 relative">
          <Link to={`/product/${product._id}`}>
            <img
              src={(product.imageDataArray && product.imageDataArray[0]) || (product.images && product.images[0]) || 'https://via.placeholder.com/300x400?text=No+Image'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </Link>

          {/* Discount Badge */}
          {product.discount > 0 && (
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 pointer-events-none">
              <span className="bg-red-500 text-white px-2 py-1 text-[10px] sm:text-xs font-medium">
                -{product.discount}%
              </span>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && !product.discount && (
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 pointer-events-none">
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

          {/* Favorite Button Overlay */}
          <button
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all transform hover:scale-110 z-10"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            />
          </button>

          {/* Quick Add Button */}
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleQuickAdd}
              className="w-full py-2 sm:py-2.5 bg-white text-black text-[10px] sm:text-xs font-bold tracking-widest hover:bg-gray-100 transition-colors uppercase shadow-lg"
            >
              {product.sizes?.length > 1 || product.colors?.length > 1 ? 'Select Options' : 'Add to Bag'}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <Link to={`/product/${product._id}`}>
                <h3 className="font-medium text-sm sm:text-base truncate hover:underline">{product.name}</h3>
              </Link>
              <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider">{product.brand}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-black font-bold text-sm sm:text-base">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice && (
              <p className="text-gray-400 line-through text-xs">
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
