import React from 'react';
import { Search } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-64 bg-gray-100 overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&h=400&fit=crop" 
        alt="Hero" 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
        <h1 className="text-9xl font-bold text-white" style={{ fontSize: '12rem', letterSpacing: '-0.02em' }}>
          shop
        </h1>
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-8 py-3 rounded-full shadow-lg">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search on Stuffsus"
            className="outline-none text-sm w-64"
          />
          <button className="bg-black text-white px-4 py-1 rounded-full text-xs">
            Search
          </button>
        </div>
      </div>
    </section>
  );
}