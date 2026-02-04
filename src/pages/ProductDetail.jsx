import React, { useState, useEffect, useMemo } from 'react';
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
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useCategoryTree } from '../hooks/useCategoryTree';
import { getDisplayPrice, getLeastAvailableSize } from '../utils/sizeUtils';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, getRelatedProducts } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Determine if we already have this product to avoid initial skeleton flicker
  const existingProduct = getProductById(id);
  const [product, setProduct] = useState(existingProduct);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Helper to get initial size
  const getInitialSize = (p) => {
    if (!p) return '';
    return getLeastAvailableSize(p);
  };

  // Helper to get initial color index (default color or first)
  const getInitialColorIndex = (p) => {
    if (!p?.colorVariants?.length) return 0;
    const defaultIndex = p.colorVariants.findIndex(c => c.isDefault);
    return defaultIndex >= 0 ? defaultIndex : 0;
  };

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isLoading, setIsLoading] = useState(!existingProduct);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage('recentlyViewed', []);
  const { getCategoryBreadcrumbs } = useCategoryTree();

  const breadcrumbs = useMemo(() => {
    if (!product) return [];
    // Deepest category ID
    const deepId = product.subCategoryId || product.categoryId;
    if (!deepId) return [];
    return getCategoryBreadcrumbs(deepId);
  }, [product, getCategoryBreadcrumbs]);

  // Get images for selected color
  const selectedColorImages = useMemo(() => {
    if (!product) return [];

    // Check for colorVariants first (new structure)
    if (product.colorVariants?.length > 0) {
      const colorVariant = product.colorVariants[selectedColorIndex];
      if (colorVariant?.images?.length > 0) {
        return colorVariant.images;
      }
    }

    // Fallback to imageDataArray or images
    return product.imageDataArray?.length > 0
      ? product.imageDataArray
      : (product.images || []);
  }, [product, selectedColorIndex]);

  // Get selected color info
  const selectedColor = useMemo(() => {
    if (!product?.colorVariants?.length) return null;
    return product.colorVariants[selectedColorIndex];
  }, [product, selectedColorIndex]);

  // Backward compatible - get color hex for cart
  const selectedColorHex = useMemo(() => {
    if (selectedColor) return selectedColor.hexCode;
    // Fallback to legacy colors array
    if (product?.colors?.length > 0) {
      return product.colors[selectedColorIndex] || product.colors[0];
    }
    return null;
  }, [selectedColor, product, selectedColorIndex]);

  // Reset state when ID changes to ensure we don't show old product data
  useEffect(() => {
    const existing = getProductById(id);
    setProduct(existing);
    if (existing) {
      setSelectedSize(getInitialSize(existing));
      setSelectedColorIndex(getInitialColorIndex(existing));
    } else {
      setSelectedSize('');
      setSelectedColorIndex(0);
    }
    setQuantity(1);
    setIsLoading(!existing);
    setError(null);
  }, [id, getProductById]);

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      // We already handled initial state in the ID watch effect

      try {
        const data = await productService.getById(id);
        if (!isMounted) return;

        const foundProduct = data.product;

        if (foundProduct) {
          const related = getRelatedProducts(id);
          const defaultSize = getLeastAvailableSize(foundProduct);
          const defaultColorIdx = getInitialColorIndex(foundProduct);

          setProduct(foundProduct);
          setRelatedProducts(related);

          // Only update selections if user hasn't made them yet or we just switched products
          if (!product || product._id !== foundProduct._id) {
            setSelectedSize(defaultSize);
            setSelectedColorIndex(defaultColorIdx);
          }

          setRecentlyViewed(prev => {
            const filtered = (prev || []).filter(pid => pid !== id);
            return [id, ...filtered].slice(0, 10);
          });
        } else {
          setError('Product not found');
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch product:', err);
          setError(err.response?.data?.error || 'Failed to load product details. Please try again later.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProduct();
    return () => { isMounted = false; };
  }, [id, setRecentlyViewed, getRelatedProducts]);

  // Handlers to update selections
  const handleSizeSelect = (size) => {
    console.log('[ProductDetail] Size selected:', size);
    setSelectedSize(size);
  };

  const handleColorSelect = (index) => {
    console.log('[ProductDetail] Color selected:', index);
    setSelectedColorIndex(index);
  };

  const handleAddToCart = () => {
    setShowError(false);

    // Determine if color selection is required
    const hasMultipleColors = (product.colorVariants?.length > 1) || (product.colors?.length > 1);

    console.log('Adding to cart:', { product: product.name, selectedSize, selectedColorHex, quantity });
    const success = addToCart(product, selectedSize, selectedColorHex, quantity);
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

  const displayPrice = getDisplayPrice(product, selectedSize, selectedColorHex);

  // Determine if product has multiple colors
  const hasMultipleColors = product && (
    (product.colorVariants?.length > 1) ||
    (product.colors?.length > 1)
  );

  // Determine if using new colorVariants structure
  const hasColorVariants = product?.colorVariants?.length > 0;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
          <X className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors"
        >
          BACK TO SHOP
        </Link>
      </div>
    );
  }

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
        <nav className="flex items-center gap-2 text-sm text-gray-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link to="/" className="hover:text-black transition-colors flex-shrink-0">Home</Link>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />

          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb._id}>
              <Link
                to={index === 0 ? `/products?categoryId=${crumb._id}` : `/products?categoryId=${breadcrumbs[0]._id}&subCategoryId=${crumb._id}`}
                className="hover:text-black transition-colors flex-shrink-0"
              >
                {crumb.name}
              </Link>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            </React.Fragment>
          ))}

          <span className="text-black truncate">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <ProductGallery
              images={product.imageDataArray?.length > 0
                ? [...product.imageDataArray, ...(product.images || [])]
                : product.images}
              selectedColorImages={selectedColorImages}
              productName={product.name}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>

          <div className="space-y-6">
            <div>

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
              <p className="text-3xl font-bold">
                {formatPrice(displayPrice)}
              </p>
              {product.originalPrice && (
                <>
                  <p className="text-xl text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
                  <span className="bg-red-500 text-white px-2 py-1 text-sm font-medium">-{product.discount}%</span>
                </>
              )}
            </div>

            <div>
              {(() => {
                // Logic to determine stock for current selection
                const currentVariant = hasColorVariants ? product.colorVariants[selectedColorIndex] : null;

                let stock = 0;
                let isAvailable = false;

                if (selectedSize) {
                  if (currentVariant && currentVariant.sizes) {
                    const sizeObj = currentVariant.sizes.find(s => s.size === selectedSize);
                    stock = sizeObj ? sizeObj.stock : 0;
                  } else if (product.size_variants?.[selectedSize]) {
                    stock = product.size_variants[selectedSize].stock;
                  } else {
                    // Fallback to global stock if no size variants map
                    stock = product.stock;
                  }
                  isAvailable = stock > 0;
                } else {
                  // No size selected, showing global status
                  // If colors exist, maybe show "Select Size" or aggregated stock
                  stock = product.stock; // Total stock calculated by virtual
                  isAvailable = stock > 0;
                }

                if (selectedSize) {
                  if (isAvailable) {
                    return (
                      <p className="text-sm text-green-600 font-medium">
                        ✓ In Stock ({stock} available for size {selectedSize})
                      </p>
                    );
                  } else {
                    return (
                      <p className="text-sm text-red-600 font-medium">Size {selectedSize} is Out of Stock</p>
                    );
                  }
                } else {
                  // Global status
                  if (isAvailable) {
                    return <p className="text-sm text-green-600 font-medium">✓ In Stock ({stock} total available)</p>;
                  } else {
                    return <p className="text-sm text-red-600 font-medium">Out of Stock</p>;
                  }
                }
              })()}
            </div>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Color Selector - Show BEFORE size selector, only if multiple colors */}
            {hasMultipleColors && (
              <ColorSelector
                colorVariants={hasColorVariants ? product.colorVariants : []}
                selectedColorIndex={selectedColorIndex}
                onSelectColor={handleColorSelect}
                error={showError && selectedColorIndex === null}
                showPreview={true}
                // Legacy props for backward compatibility
                colors={!hasColorVariants ? product.colors : []}
                colorNames={!hasColorVariants ? product.colorNames : []}
                selectedColor={selectedColorHex}
              />
            )}

            {product.sizes && product.sizes.length > 0 && (
              <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSelectSize={handleSizeSelect}
                stock={(() => {
                  const currentVariant = hasColorVariants ? product.colorVariants[selectedColorIndex] : null;
                  if (currentVariant && currentVariant.sizes) {
                    const s = currentVariant.sizes.find(sz => sz.size === selectedSize);
                    return s ? s.stock : 0;
                  }
                  return selectedSize && product.size_variants?.[selectedSize] ? product.size_variants[selectedSize].stock : product.stock;
                })()}
                error={showError && !selectedSize}
                availableSizes={(() => {
                  const currentVariant = hasColorVariants ? product.colorVariants[selectedColorIndex] : null;
                  if (currentVariant && currentVariant.sizes) {
                    return currentVariant.sizes.filter(s => s.stock > 0).map(s => s.size);
                  }
                  return product.available_sizes;
                })()}
              />
            )}

            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
              stock={(() => {
                const currentVariant = hasColorVariants ? product.colorVariants[selectedColorIndex] : null;
                if (currentVariant && currentVariant.sizes && selectedSize) {
                  const s = currentVariant.sizes.find(sz => sz.size === selectedSize);
                  return s ? s.stock : 0;
                }
                return selectedSize && product.size_variants?.[selectedSize] ? product.size_variants[selectedSize].stock : product.stock;
              })()}
            />

            <div className="flex gap-3">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={
                  (() => {
                    const currentVariant = hasColorVariants ? product.colorVariants[selectedColorIndex] : null;
                    if (currentVariant && currentVariant.sizes && selectedSize) {
                      const s = currentVariant.sizes.find(sz => sz.size === selectedSize);
                      return !s || s.stock === 0;
                    }
                    return (selectedSize && product.size_variants?.[selectedSize]?.stock === 0) || (!selectedSize && product.stock === 0);
                  })()
                }
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
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="text-base">{product.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Available Sizes</p>
                  <p className="text-base">{product.sizes?.join(', ') || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Available Colors</p>
                  <p className="text-base">
                    {hasColorVariants
                      ? product.colorVariants.map(c => c.name).join(', ')
                      : (product.colorNames?.join(', ') || product.colors?.length || 'N/A')}
                  </p>
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
