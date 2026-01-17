import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductsContext';

const Footer = () => {
  const { config } = useProducts();

  return (
    <footer className="py-10 sm:py-12 border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{config.storeName}</h2>
          <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base">
            Minimal streetwear essentials for urban living.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-6 sm:mb-8">
          <Link to="/" className="text-sm font-medium hover:text-gray-600 transition-colors">
            Shop
          </Link>
          <Link to="/" className="text-sm font-medium hover:text-gray-600 transition-colors">
            New Arrivals
          </Link>
          <Link to="/" className="text-sm font-medium hover:text-gray-600 transition-colors">
            Collections
          </Link>
          <Link to="/" className="text-sm font-medium hover:text-gray-600 transition-colors">
            About
          </Link>
          <Link to="/" className="text-sm font-medium hover:text-gray-600 transition-colors">
            Contact
          </Link>
        </div>

        <div className="text-center pt-6 sm:pt-8 border-t border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">
            © 2024 {config.storeName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
