import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Star, Heart, Share2, Truck, RotateCcw } from 'lucide-react';
import { useProducts } from '../contexts/ProductsContext';
import productService from '../services/productService';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/formatPrice';
import ProductGallery from '../components/product/ProductGallery';
import SizeSelector from '../components/product/SizeSelector';
import ColorSelector from '../components/product/ColorSelector';
import QuantitySelector from '../components/product/QuantitySelector';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/common/Button';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, getRelatedProducts } = useProducts();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [favorites, setFavorites] = useLocalStorage('favorites', []);
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage('recentlyViewed', []);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        // Try to get from context first
        let foundProduct = getProductById(id);
        
        // If not in context, fetch from API
        if (!foundProduct) {
          try {
            const data = await productService.getById(id);
            foundProduct = data.product;
          } catch (err) {
            console.error('Failed to fetch product:', err);
            navigate('/');
            return;
          }
        }

        if (foundProduct) {
          setProduct(foundProduct);
          setRelatedProducts(getRelatedProducts(id));
          
          // Set default selections if only one option
          if (foundProduct.sizes.length === 1) {
            setSelectedSize(foundProduct.sizes[0]);
          }
          if (foundProduct.colors.length === 1) {
            setSelectedColor(foundProduct.colors[0]);
          }

          // Add to recently viewed
          setRecentlyViewed(prev => {
            if (!prev) return [id];
            const filtered = prev.filter(pid => pid !== id);
            return [id, ...filtered].slice(0, 10);
          });
        }
      } catch (error) {
        console.error('Error in product detail:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, getProductById, getRelatedProducts, navigate, setRecentlyViewed]);


  const handleAddToCart = () => {
    setShowError(false);
    const success = addToCart(product, selectedSize, selectedColor);
    if (!success) {
      setShowError(true);
    } else {
      // Reset selections for next add
      setQuantity(1);
    }
  };

  const handleToggleFavorite = () => {
    setFavorites(prev => {
      if (prev.includes(product.id)) {
        return prev.filter(id => id !== product.id);
      }
      return [...prev, product.id];
    });
  };

  if (isLoading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSkeleton variant="product-detail" />
      </div>
    );
  }

  const isFavorite = favorites.includes(product.id);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/" className="hover:text-black transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-black">{product.name}</span>
        </nav>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Gallery */}
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand and Name */}
            <div>
              <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
              <h1 className="text-3xl sm:text-4xl font-bold">{product.name}</h1>
            </div>

            {/* Rating and Reviews */}
            {product.rating && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3">
              <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
              {product.originalPrice && (
                <>
                  <p className="text-xl text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </p>
                  <span className="bg-red-500 text-white px-2 py-1 text-sm font-medium">
                    -{product.discount}%
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div>
              {product.stock > 0 ? (
                <p className="text-sm text-green-600 font-medium">
                  ✓ In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-sm text-red-600 font-medium">Out of Stock</p>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Size Selector */}
            {product.sizes.length > 1 && (
              <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
                stock={product.stock}
                error={showError && !selectedSize}
              />
            )}

            {/* Color Selector */}
            {product.colors.length > 1 && (
              <ColorSelector
                colors={product.colors}
                colorNames={product.colorNames}
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
                error={showError && !selectedColor}
              />
            )}

            {/* Quantity Selector */}
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
              stock={product.stock}
            />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                ADD TO CART
              </Button>
              <button
                onClick={handleToggleFavorite}
                className="p-3 border border-gray-300 rounded hover:border-black transition-colors"
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart
                  className={`w-6 h-6 ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`}
                />
              </button>
              <button
                className="p-3 border border-gray-300 rounded hover:border-black transition-colors"
                aria-label="Share product"
              >
                <Share2 className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="w-5 h-5 text-gray-600" />
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="w-5 h-5 text-gray-600" />
                <span>30-day return policy</span>
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16 border-t border-gray-200">
          <div className="flex gap-8 border-b border-gray-200">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                <h3 className="text-lg font-bold mt-6 mb-3">Features</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Premium quality materials</li>
                  <li>Comfortable fit for all-day wear</li>
                  <li>Durable construction</li>
                  <li>Easy care and maintenance</li>
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Brand</p>
                  <p className="text-base">{product.brand}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="text-base">{product.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Available Sizes</p>
                  <p className="text-base">{product.sizes.join(', ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Available Colors</p>
                  <p className="text-base">{product.colorNames?.join(', ') || product.colors.length}</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-8">
                <p className="text-gray-500">Reviews coming soon</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  isFavorite={favorites.includes(relatedProduct.id)}
                  onToggleFavorite={() => {
                    setFavorites(prev => {
                      if (prev.includes(relatedProduct.id)) {
                        return prev.filter(id => id !== relatedProduct.id);
                      }
                      return [...prev, relatedProduct.id];
                    });
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
