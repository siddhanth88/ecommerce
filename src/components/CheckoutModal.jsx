import React from 'react';
import { X } from 'lucide-react';

export default function CheckoutModal({ checkoutOpen, setCheckoutOpen, cartItems, cartTotal }) {
  if (!checkoutOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-gray-900/50" onClick={() => setCheckoutOpen(false)}></div>
      <div className="relative bg-white shadow-2xl p-8 w-full max-w-2xl my-8 rounded-lg">
        <button 
          onClick={() => setCheckoutOpen(false)}
          className="absolute top-6 right-6"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-8">CHECKOUT</h3>
        
        <div className="space-y-8">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">ORDER SUMMARY</h4>
            <div className="space-y-3 bg-gray-50 p-6 rounded-lg">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.name} × {item.quantity}</span>
                  <span className="text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-gray-300 pt-3 flex justify-between font-medium">
                <span>Total</span>
                <span className="text-gray-900">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">SHIPPING</h4>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Full Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900"
              />
              <input 
                type="text" 
                placeholder="Address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900"
              />
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text" 
                  placeholder="City"
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900"
                />
                <input 
                  type="text" 
                  placeholder="Postal Code"
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900"
                />
              </div>
            </div>
          </div>

          <button className="w-full py-4 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-all">
            COMPLETE ORDER
          </button>
        </div>
      </div>
    </div>
  );
}