import React from 'react';
import { X } from 'lucide-react';

export default function Cart({ 
  cartOpen, 
  setCartOpen, 
  cartItems, 
  removeFromCart, 
  updateQuantity, 
  cartTotal, 
  setCheckoutOpen 
}) {
  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gray-900/50" onClick={() => setCartOpen(false)}></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <h3 className="text-xl font-bold">Shopping Cart</h3>
            <button onClick={() => setCartOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center py-12">Your cart is empty</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{item.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 border rounded flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 border rounded flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)}>
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button 
                onClick={() => { 
                  setCartOpen(false); 
                  setCheckoutOpen(true); 
                }}
                className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}