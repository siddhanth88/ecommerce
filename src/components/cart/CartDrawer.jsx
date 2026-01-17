import React from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/formatPrice';
import CartItem from './CartItem';
import Button from '../common/Button';

/**
 * Cart Drawer Component
 * @param {Object} props
 * @param {boolean} props.isOpen - Drawer open state
 * @param {Function} props.onClose - Close handler
 */
const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cartItems, subtotal, tax, total, itemCount } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold">
              SHOPPING BAG {itemCount > 0 && `(${itemCount})`}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items or Empty State */}
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2 text-center">Your bag is empty</p>
              <p className="text-sm text-gray-400 mb-6 text-center">
                Add some items to get started
              </p>
              <Button onClick={onClose} variant="outline">
                CONTINUE SHOPPING
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto px-6">
                {cartItems.map((item) => (
                  <CartItem key={item.cartItemId} item={item} />
                ))}
              </div>

              {/* Footer with Totals */}
              <div className="border-t border-gray-100 p-6 space-y-4 bg-gray-50">
                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>

                {/* Total */}
                <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-200">
                  <span>TOTAL</span>
                  <span>{formatPrice(total)}</span>
                </div>

                {/* Checkout Button */}
                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="w-full inline-flex items-center justify-center font-medium tracking-wide transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black bg-black text-white hover:bg-gray-800 px-8 py-3 text-base"
                >
                  CHECKOUT
                </Link>

                {/* Continue Shopping */}
                <button
                  onClick={onClose}
                  className="w-full text-sm font-medium hover:text-gray-600 transition-colors py-2"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
