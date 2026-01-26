import React, { useState, useEffect } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import SizeSelector from './SizeSelector';
import ColorSelector from './ColorSelector';
import QuantitySelector from './QuantitySelector';
import { useCart } from '../../contexts/CartContext';

const QuickAddModal = ({ product, isOpen, onClose }) => {
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    // Handlers to update selections
    const handleSizeSelect = (size) => {
        console.log('[QuickAddModal] Size selected:', size, '| Current error state:', error);
        setSelectedSize(size);
    };

    const handleColorSelect = (color) => {
        console.log('[QuickAddModal] Color selected:', color, '| Current error state:', error);
        setSelectedColor(color);
    };

    useEffect(() => {
        if (isOpen && product) {
            if (product.sizes?.length === 1) setSelectedSize(product.sizes[0]);
            if (product.colors?.length === 1) setSelectedColor(product.colors[0]);
            setQuantity(1);
            setError(false);
        }
    }, [isOpen, product]);

    if (!isOpen || !product) return null;

    const handleAddToCart = () => {
        // Validate selection
        if ((product.sizes?.length > 1 && !selectedSize) ||
            (product.colors?.length > 1 && !selectedColor)) {
            setError(true);
            return;
        }

        setIsAdding(true);
        const success = addToCart({
            ...product,
            quantity // Pass quantity implicitly or handle in context? 
            // Context addToCart doesn't take quantity usually, but adds 1. 
            // Let's loop or update context? 
            // Checking context: addToCart(product, size, color) -> adds 1 quantity.
            // We need to call it multiple times or update context to support quantity.
            // For now, let's just add 1, or better: modify cart context later. 
            // Actually, standard quick add is usually 1 item.
            // But user REQUESTED quantity selection.
            // So we'll call addToCart, then updateQuantity if needed?
            // Or simply: addToCart should potentially accept quantity.
            // Let's check context. Context `addToCart` adds 1.
        }, selectedSize, selectedColor);

        // Using a loop to add quantity? No, that's bad.
        // Let's modify logic: 
        // We will call addToCart once. If successful, we update quantity if > 1.
        // But addToCart returns true/false.
        // Wait, cart context implementation:
        // addToCart checks existing index. If exists, +1. If not, pushes new with quantity 1.
        // So we can't easily set quantity > 1 with current context without multiple calls or context refactor.
        // I will refactor context to accept quantity or just loop for now? 
        // Looping 50 times is bad.
        // I will assume for now we add 1, OR I will make a quick context patch if easy.
        // Checking context... `addToCart` takes (product, size, color).
        // I will stick to adding 1 for now, or calling it `quantity` times.
        // Actually, `QuantitySelector` is in the requirements.
        // Let's do: call addToCart once, then if quantity > 1, call updateQuantity?
        // We need the cartItemId returned or predictable.
        // CartContext doesn't return ID.
        // Okay, I will modify CartContext to accept quantity in next step if needed. 
        // For now, let's implement the modal and pass quantity to addToCart (assuming I will update context).
    };

    // Re-reading context: addToCart doesn't take quantity.
    // I will just add 1 for now and note to refactor context or loop.
    // Wait, I can loop `quantity` times?
    // `for(let i=0; i<quantity; i++) addToCart(...)`
    // It's synchronous state update in usage? `setCartItems(prev => ...)`
    // Yes, functional updates queue correctly.

    const handleAdd = () => {
        if ((product.sizes?.length > 1 && !selectedSize) ||
            (product.colors?.length > 1 && !selectedColor)) {
            setError(true);
            return;
        }

        setIsAdding(true);
        for (let i = 0; i < quantity; i++) {
            addToCart(product, selectedSize, selectedColor);
        }

        setTimeout(() => {
            setIsAdding(false);
            onClose();
        }, 500);
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
                    <div className="hidden sm:block sm:w-2/5 aspect-[3/4] sm:aspect-auto bg-gray-100 relative">
                        <img
                            src={(product.imageDataArray && product.imageDataArray[0]) || (product.images && product.images[0]) || 'https://via.placeholder.com/300x400'}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                    {/* Mobile Image (Small header) */}
                    <div className="sm:hidden h-32 bg-gray-50 flex items-center justify-center flex-shrink-0 border-b border-gray-100">
                        <img
                            src={(product.imageDataArray && product.imageDataArray[0]) || (product.images && product.images[0]) || 'https://via.placeholder.com/300x400'}
                            alt={product.name}
                            className="h-full w-auto object-contain"
                        />
                    </div>

                    {/* Details */}
                    <div className="p-6 sm:w-3/5 overflow-y-auto max-h-[80vh] sm:max-h-full">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">{product.brand}</p>

                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-xl font-bold">{formatPrice(product.price)}</span>
                            {product.originalPrice && (
                                <span className="text-sm text-gray-400 line-through">
                                    {formatPrice(product.originalPrice)}
                                </span>
                            )}
                        </div>

                        <div className="space-y-6">
                            {product.sizes?.length > 0 && (
                                <SizeSelector
                                    sizes={product.sizes}
                                    selectedSize={selectedSize}
                                    onSelectSize={handleSizeSelect}
                                    stock={product.stock}
                                    error={error && !selectedSize}
                                />
                            )}

                            {product.colors?.length > 0 && (
                                <ColorSelector
                                    colors={product.colors}
                                    colorNames={product.colorNames}
                                    selectedColor={selectedColor}
                                    onSelectColor={handleColorSelect}
                                    error={error && !selectedColor}
                                />
                            )}

                            <QuantitySelector
                                quantity={quantity}
                                onQuantityChange={setQuantity}
                                stock={product.stock}
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
