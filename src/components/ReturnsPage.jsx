import React from 'react';

export default function ReturnsPage({ setCurrentPage }) {
  return (
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Return Policy</h2>
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">30-Day Return Policy</h3>
            <p>
              We offer a 30-day return policy on all products. If you're not completely satisfied with your 
              purchase, you can return it within 30 days of delivery for a full refund or exchange.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Return Conditions</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Items must be in their original condition and packaging</li>
              <li>All tags and labels must be attached</li>
              <li>Proof of purchase is required</li>
              <li>Items must not have been used or damaged</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">How to Return</h3>
            <p>
              Contact our customer service team to initiate a return. We'll provide you with a return shipping 
              label and instructions. Once we receive your return, we'll process your refund within 5-7 business days.
            </p>
          </div>
        </div>
        <button 
          onClick={() => setCurrentPage('home')}
          className="mt-8 px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
        >
          BACK TO SHOP
        </button>
      </div>
    </div>
  );
}