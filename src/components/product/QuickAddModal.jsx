import React, { useState, useEffect, useMemo } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import SizeSelector from './SizeSelector';
import ColorSelector from './ColorSelector';
import QuantitySelector from './QuantitySelector';
import { useCart } from '../../contexts/CartContext';
import { getDisplayPrice, getLeastAvailableSize } from '../../utils/sizeUtils';

const QuickAddModal = ({ product, isOpen, onClose, initialColorIndex = 0 }) => {
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColorIndex, setSelectedColorIndex] = useState(initialColorIndex);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    // Get color info
    const hasColorVariants = product?.colorVariants?.length > 0;

    // Update selected color when initialColorIndex changes (e.g. modal reused for different products)
    useEffect(() => {
        setSelectedColorIndex(initialColorIndex);
    }, [initialColorIndex, product]);

    // Reset size and quantity when product changes
    useEffect(() => {
        if (product) {
            setSelectedSize('');
            setQuantity(1);
        }
    }, [product]);

    // Get currently selected image
    const selectedImage = useMemo(() => {
        if (!product) return '';

        // If using colorVariants, use image from selected color
        if (hasColorVariants && selectedColorIndex !== null) {
            const colorVariant = product.colorVariants[selectedColorIndex];
            if (colorVariant?.images?.length > 0) {
                return colorVariant.images[0];
            }
        }

        // Fallback to legacy colors if they have specific imagery (usually not, but good for completeness)
        // For legacy, we usually just show the main images.

        // Absolute fallbacks
        return (product.imageDataArray && product.imageDataArray[0]) ||
            (product.images && product.images[0]) ||
            product.image ||
            'https://via.placeholder.com/300x400?text=No+Image';
    }, [product, selectedColorIndex, hasColorVariants]);

    // Backward compatible - get color hex for cart
    const selectedColorHex = useMemo(() => {
        if (hasColorVariants) {
            return product.colorVariants[selectedColorIndex]?.hexCode;
        }
        return product?.colors?.[selectedColorIndex] || product?.colors?.[0] || null;
    }, [product, selectedColorIndex, hasColorVariants]);

    useEffect(() => {
        if (isOpen && product) {
            // Select least available size by default
            const defaultSize = getLeastAvailableSize(product);
            if (defaultSize) {
                setSelectedSize(defaultSize);
            }

            // ONLY set default color if initialColorIndex is 0 (or some default value)
            // Actually, it's better to rely on the props value which defaults to 0.
            // If the user hasn't passed anything, it will be 0.
            if (initialColorIndex === 0 && hasColorVariants) {
                const idx = product.colorVariants.findIndex(c => c.isDefault);
                if (idx >= 0) setSelectedColorIndex(idx);
            }

            setQuantity(1);
            setError(false);
        }
    }, [isOpen, product, hasColorVariants, initialColorIndex]);

    if (!isOpen || !product) return null;

    const displayPrice = getDisplayPrice(product, selectedSize, selectedColorHex);

    // Determine if multiple colors exist
    const hasMultipleColors = (product.colorVariants?.length > 1) || (product.colors?.length > 1);

    const handleAdd = async () => {
        if ((product.sizes?.length > 1 && !selectedSize)) {
            setError(true);
            return;
        }

        setIsAdding(true);
        const success = addToCart(product, selectedSize, selectedColorHex, quantity);

        if (success) {
            setTimeout(() => {
                setIsAdding(false);
                onClose();
            }, 500);
        } else {
            setIsAdding(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col sm:flex-row h-full">
                    {/* Image */}
                    <div className="hidden sm:block sm:w-2/5 aspect-[3/4] sm:aspect-auto bg-gray-100 relative transition-all duration-300">
                        <img
                            src={selectedImage}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                    {/* Mobile Image (Small header) */}
                    <div className="sm:hidden h-32 bg-gray-50 flex items-center justify-center flex-shrink-0 border-b border-gray-100 transition-all duration-300">
                        <img
                            src={selectedImage}
                            alt={product.name}
                            className="h-full w-auto object-contain"
                        />
                    </div>

                    {/* Details */}
                    <div className="p-6 sm:w-3/5 overflow-y-auto max-h-[80vh] sm:max-h-full">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>


                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-xl font-bold">
                                {formatPrice(displayPrice)}
                            </span>
                            {product.originalPrice && (
                                <span className="text-sm text-gray-400 line-through">
                                    {formatPrice(product.originalPrice)}
                                </span>
                            )}
                        </div>

                        <div className="space-y-6">
                            {/* Color Selector */}
                            {hasMultipleColors && (
                                <ColorSelector
                                    colorVariants={hasColorVariants ? product.colorVariants : []}
                                    selectedColorIndex={selectedColorIndex}
                                    onSelectColor={setSelectedColorIndex}
                                    error={error && selectedColorIndex === null}
                                    // Legacy props
                                    colors={!hasColorVariants ? product.colors : []}
                                    colorNames={!hasColorVariants ? product.colorNames : []}
                                    selectedColor={selectedColorHex}
                                />
                            )}

                            {product.sizes?.length > 0 && (
                                <SizeSelector
                                    sizes={product.sizes}
                                    selectedSize={selectedSize}
                                    onSelectSize={setSelectedSize}
                                    stock={selectedSize && product.size_variants?.[selectedSize] ? product.size_variants[selectedSize].stock : product.stock}
                                    error={error && !selectedSize}
                                    availableSizes={product.available_sizes}
                                />
                            )}

                            <QuantitySelector
                                quantity={quantity}
                                onQuantityChange={setQuantity}
                                stock={selectedSize && product.size_variants?.[selectedSize] ? product.size_variants[selectedSize].stock : product.stock}
                            />

                            <button
                                onClick={handleAdd}
                                disabled={isAdding}
                                className="w-full py-3 bg-black text-white text-sm font-bold tracking-widest hover:bg-gray-800 transition-colors rounded-lg flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isAdding ? 'ADDING...' : (
                                    <>
                                        <ShoppingBag className="w-4 h-4" />
                                        ADD TO BAG
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickAddModal;
