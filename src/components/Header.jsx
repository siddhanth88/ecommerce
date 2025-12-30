import React from 'react';
import { ShoppingCart, Search, User, Heart } from 'lucide-react';

export default function Header({ cartOpen, setCartOpen, setLoginOpen, cartItems, setCurrentPage }) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-12">
            <button onClick={() => setCurrentPage('home')} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white rounded-sm"></div>
              </div>
              <span className="text-xl font-bold">Stuffsus</span>
            </button>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Brands</a>
              <button onClick={() => setCurrentPage('home')} className="text-sm font-medium text-gray-900">Shop</button>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Blog</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full relative">
              <Heart className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button 
              onClick={() => setCartOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setLoginOpen(true)}
              className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}