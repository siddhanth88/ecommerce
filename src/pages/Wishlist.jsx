import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Heart, ArrowRight, X } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/formatPrice';
import Button from '../components/common/Button';
import QuickAddModal from '../components/product/QuickAddModal';

const Wishlist = () => {
    const { wishlistItems, toggleWishlist, loading } = useWishlist();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [addingToCart, setAddingToCart] = useState(null);
    const [quickAddProduct, setQuickAddProduct] = useState(null);

    const handleAddToCart = (product) => {
        // For products with multiple variants, open modal
        if ((product.sizes && product.sizes.length > 1) || (product.colors && product.colors.length > 1)) {
            setQuickAddProduct(product);
            return;
        }

        // For single variant products, add directly
        const defaultSize = product.sizes?.length === 1 ? product.sizes[0] : null;
        const defaultColor = product.colors?.length === 1 ? product.colors[0] : null;

        setAddingToCart(product._id);
        addToCart(product, defaultSize, defaultColor);
        setTimeout(() => setAddingToCart(null), 1000);
    };

    if (loading && wishlistItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                    <p className="mt-2 text-gray-500">
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>
                <Link
                    to="/products"
                    className="text-black font-medium flex items-center gap-2 hover:underline"
                >
                    Continue Shopping <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {wishlistItems.length > 0 ? (
                <div className="space-y-6">
                    {wishlistItems.map((product) => (
                        <div
                            key={product._id}
                            className="flex flex-col sm:flex-row gap-6 p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow group relative"
                        >
                            {/* Remove Button (Top Right absolute) */}
                            <button
                                onClick={() => toggleWishlist(product._id)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
                                aria-label="Remove from wishlist"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>

                            {/* Image */}
                            <div className="w-full sm:w-40 aspect-[3/4] sm:aspect-square flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                <Link to={`/product/${product._id}`}>
                                    <img
                                        src={(product.imageDataArray && product.imageDataArray[0]) || (product.images && product.images[0]) || 'https://via.placeholder.com/300x400?text=No+Image'}
                                        alt={product.name}
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                    />
                                </Link>
                            </div>

                            {/* Details */}
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <div className="flex justify-between items-start pr-12">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{product.brand}</p>
                                            <Link to={`/product/${product._id}`}>
                                                <h3 className="text-lg font-bold text-gray-900 hover:text-gray-700 transition-colors">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center gap-3">
                                        <p className="text-lg font-bold text-black">
                                            {formatPrice(product.price)}
                                        </p>
                                        {product.originalPrice && (
                                            <>
                                                <p className="text-sm text-gray-400 line-through">
                                                    {formatPrice(product.originalPrice)}
                                                </p>
                                                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">
                                                    -{product.discount}%
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {(product.sizes?.length > 0 || product.colors?.length > 0) && (
                                        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
                                            {product.sizes?.length > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-900">Sizes:</span>
                                                    <span>{product.sizes.join(', ')}</span>
                                                </div>
                                            )}
                                            {product.colors?.length > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-900">Colors:</span>
                                                    <div className="flex gap-1">
                                                        {product.colors.map(color => (
                                                            <div
                                                                key={color}
                                                                className="w-3 h-3 rounded-full border border-gray-200"
                                                                style={{ backgroundColor: color }}
                                                                title={color}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 sm:mt-0 pt-4 sm:pt-0 sm:self-start w-full sm:w-auto">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        disabled={addingToCart === product._id}
                                        className="w-full sm:w-auto px-6 py-3 bg-black text-white text-sm font-bold tracking-widest hover:bg-gray-800 transition-colors rounded-lg flex items-center justify-center gap-2"
                                    >
                                        {addingToCart === product._id ? (
                                            'Added!'
                                        ) : (
                                            <>
                                                <ShoppingBag className="w-4 h-4" />
                                                {(product.sizes?.length > 1 || product.colors?.length > 1) ? 'Select Options' : 'Add to Bag'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm mb-6">
                        <Heart className="w-10 h-10 text-gray-300" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                    <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                        Save items you love here and they'll be waiting for you when you're ready to buy.
                    </p>
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => navigate('/products')}
                    >
                        Explore Products
                    </Button>
                </div>
            )}

            <QuickAddModal
                product={quickAddProduct}
                isOpen={!!quickAddProduct}
                onClose={() => setQuickAddProduct(null)}
            />
        </div>
    );
};

export default Wishlist;
