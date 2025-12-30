import React from 'react';

export default function ShippingPage({ setCurrentPage }) {
  return (
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Shipping Policy</h2>
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Shipping Options</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Standard Shipping:</strong> 5-7 business days - $5.99</li>
              <li><strong>Express Shipping:</strong> 2-3 business days - $12.99</li>
              <li><strong>Overnight Shipping:</strong> 1 business day - $24.99</li>
              <li><strong>Free Shipping:</strong> Orders over $50 qualify for free standard shipping</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Processing Time</h3>
            <p>
              Orders are typically processed within 1-2 business days. You'll receive a tracking number via 
              email once your order ships. Please note that processing times may be longer during peak seasons.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">International Shipping</h3>
            <p>
              We currently ship to select international destinations. Shipping costs and delivery times vary 
              by location. International orders may be subject to customs fees and import duties, which are 
              the responsibility of the customer.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Order Tracking</h3>
            <p>
              Once your order ships, you'll receive a tracking number via email. You can track your package 
              on our website or directly through the carrier's website.
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