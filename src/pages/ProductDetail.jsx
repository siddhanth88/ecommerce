import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Star, Heart, Share2, Truck, RotateCcw } from 'lucide-react';
import { useProducts } from '../contexts/ProductsContext';
import productService from '../services/productService';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
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
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage('recentlyViewed', []);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        let foundProduct = getProductById(id);

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

          if (foundProduct.sizes.length === 1) {
            setSelectedSize(foundProduct.sizes[0]);
          }
          if (foundProduct.colors.length === 1) {
            setSelectedColor(foundProduct.colors[0]);
          }

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

  // Handlers to update selections
  const handleSizeSelect = (size) => {
    console.log('[ProductDetail] Size selected:', size, '| Current showError:', showError);
    setSelectedSize(size);
  };

  const handleColorSelect = (color) => {
    console.log('[ProductDetail] Color selected:', color, '| Current showError:', showError);
    setSelectedColor(color);
  };

  // Debug: Log when selectedColor or showError changes
  useEffect(() => {
    console.log('[ProductDetail] State changed - selectedColor:', selectedColor, '| showError:', showError, '| Should show error:', showError && !selectedColor);
  }, [selectedColor, showError]);

  const handleAddToCart = () => {
    setShowError(false);
    console.log('Adding to cart:', { product: product.name, selectedSize, selectedColor });
    const success = addToCart(product, selectedSize, selectedColor);
    if (!success) {
      console.log('Add to cart failed');
      setShowError(true);
    } else {
      setQuantity(1);
    }
  };

  const isFavorite = product ? isInWishlist(product._id) : false;

  const handleToggleFavorite = () => {
    if (product) {
      toggleWishlist(product._id);
    }
  };

  if (isLoading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSkeleton variant="product-detail" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/" className="hover:text-black transition-colors">{product.category}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-black">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <ProductGallery
              images={(product.imageDataArray && product.imageDataArray.length > 0)
                ? [...product.imageDataArray, ...(product.images || [])]
                : (product.images && product.images.length > 0 ? product.images : ['https://via.placeholder.com/600x600?text=No+Image'])}
              productName={product.name}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
              <h1 className="text-3xl sm:text-4xl font-bold">{product.name}</h1>
            </div>

            {product.rating && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">{product.rating} ({product.reviews} reviews)</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
              {product.originalPrice && (
                <>
                  <p className="text-xl text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
                  <span className="bg-red-500 text-white px-2 py-1 text-sm font-medium">-{product.discount}%</span>
                </>
              )}
            </div>

            <div>
              {product.stock > 0 ? (
                <p className="text-sm text-green-600 font-medium">✓ In Stock ({product.stock} available)</p>
              ) : (
                <p className="text-sm text-red-600 font-medium">Out of Stock</p>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {product.sizes.length > 1 && (
              <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSelectSize={handleSizeSelect}
                stock={product.stock}
                error={showError && !selectedSize}
              />
            )}

            {product.colors.length > 1 && (
              <ColorSelector
                colors={product.colors}
                colorNames={product.colorNames || []}
                selectedColor={selectedColor}
                onSelectColor={handleColorSelect}
                error={showError && !selectedColor}
              />
            )}

            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
              stock={product.stock}
            />

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
                className="p-3 border border-gray-300 rounded hover:border-black transition-colors"
                aria-label="Share product"
              >
                <Share2 className="w-6 h-6 text-gray-600" />
              </button>
            </div>

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

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 border-t border-gray-200">
          <div className="flex gap-8 border-b border-gray-200">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'}`}
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

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
