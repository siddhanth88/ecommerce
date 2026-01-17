import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useLocalStorage('cart', []);
  const [toast, setToast] = useState(null);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Add item to cart
  const addToCart = (product, selectedSize, selectedColor) => {
    // Validation
    if (!selectedSize && product.sizes.length > 1) {
      showToast('Please select a size', 'error');
      return false;
    }

    if (!selectedColor && product.colors.length > 1) {
      showToast('Please select a color', 'error');
      return false;
    }

    setCartItems(prev => {
      // Check if item with same size and color already exists
      const existingIndex = prev.findIndex(
        item => 
          item.id === product.id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        // Update quantity
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        showToast('Cart updated!', 'success');
        return updated;
      } else {
        // Add new item
        showToast('Added to cart!', 'success');
        return [...prev, {
          ...product,
          selectedSize,
          selectedColor,
          quantity: 1,
          cartItemId: `${product.id}-${selectedSize}-${selectedColor}-${Date.now()}`
        }];
      }
    });

    return true;
  };

  // Remove item from cart
  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  // Update item quantity
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: Math.min(newQuantity, item.stock) }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    showToast('Cart cleared', 'info');
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    tax,
    total,
    itemCount,
    toast,
    showToast
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
