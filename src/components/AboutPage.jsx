import React from 'react';

export default function AboutPage({ setCurrentPage }) {
  return (
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p className="text-lg">
            Stuffsus was founded with a vision to create timeless, elegant products that enhance everyday life. 
            We believe in quality craftsmanship, sustainable practices, and designs that stand the test of time.
          </p>
          <p>
            Our journey began with a simple idea: to bring together the best products from around the world 
            and make them accessible to everyone. Today, we're proud to serve thousands of customers who trust 
            us for their home and lifestyle needs.
          </p>
          <p>
            We're committed to sustainability, ethical sourcing, and creating a positive impact on our community 
            and the environment. Every product we offer is carefully selected to meet our high standards of 
            quality and design.
          </p>
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