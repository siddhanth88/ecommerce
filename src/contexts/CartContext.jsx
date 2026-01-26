import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import productsData from '../data/products.json';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

import orderService from '../services/orderService';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useLocalStorage('cart', []);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Add item to cart
  const addToCart = (product, selectedSize, selectedColor) => {
    // Validation
    if (!selectedSize && product.sizes.length > 1) {
      console.warn('AddToCart Validation Failed: Missing Size', {
        required: product.sizes.length > 1,
        selected: selectedSize,
        available: product.sizes
      });
      showToast('Please select a size', 'error');
      return false;
    }

    if (!selectedColor && product.colors.length > 1) {
      console.warn('AddToCart Validation Failed: Missing Color', {
        required: product.colors.length > 1,
        selected: selectedColor,
        available: product.colors
      });
      showToast('Please select a color', 'error');
      return false;
    }

    setCartItems(prev => {
      // Check if item with same size and color already exists
      const existingIndex = prev.findIndex(
        item =>
          (item._id === product._id || item.id === product.id) &&
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
          cartItemId: `${product._id || product.id}-${selectedSize}-${selectedColor}-${Date.now()}`
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
  const { config } = productsData;
  const taxRate = config.taxRate || 0; // Default to 0 if not set

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Place Order
  const placeOrder = async (shippingData) => {
    try {
      setLoading(true);

      // Filter out stale items (invalid IDs)
      const validItems = cartItems.filter(item => {
        const id = item._id || item.id;
        return id && id.length === 24; // Simple check for MongoDB ObjectId length
      });

      if (validItems.length !== cartItems.length) {
        setCartItems(validItems);
        if (validItems.length === 0) {
          showToast('Cart contained invalid items and was cleared. Please add products again.', 'error');
          return { success: false, error: 'Cart cleared due to invalid items' };
        }
        showToast('Removed unavailable items from your cart.', 'info');
      }

      const orderItems = validItems.map(item => ({
        product: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor,
        colorName: item.selectedColor,
        image: item.images[0]
      }));

      const currentSubtotal = validItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const currentTax = currentSubtotal * taxRate;

      const orderPayload = {
        items: orderItems,
        shippingAddress: shippingData.shippingAddress,
        paymentMethod: shippingData.paymentMethod,
        subtotal: currentSubtotal,
        tax: currentTax,
        total: currentSubtotal + currentTax
      };

      const response = await orderService.create(orderPayload);

      clearCart();
      showToast('Order placed successfully!', 'success');
      return { success: true, order: response.order };
    } catch (error) {
      console.error('Order placement failed:', error);
      const errorMsg = error.response?.data?.error || 'Failed to place order';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    placeOrder,
    loading,
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

