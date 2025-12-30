import React from 'react';

export default function Footer({ setCurrentPage }) {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Blog</a></li>
              <li><a href="#" className="hover:text-gray-900">Meet The Team</a></li>
              <li><button onClick={() => setCurrentPage('contact')} className="hover:text-gray-900">Contact Us</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><button onClick={() => setCurrentPage('contact')} className="hover:text-gray-900">Contact Us</button></li>
              <li><button onClick={() => setCurrentPage('shipping')} className="hover:text-gray-900">Shipping</button></li>
              <li><button onClick={() => setCurrentPage('returns')} className="hover:text-gray-900">Return</button></li>
              <li><a href="#" className="hover:text-gray-900">FAQ</a></li>
            </ul>
          </div>
          <div className="col-span-2">
            <h4 className="font-semibold mb-4">Social Media</h4>
            <div className="flex gap-3">
              <button className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800">
                𝕏
              </button>
              <button className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800">
                f
              </button>
              <button className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800">
                in
              </button>
              <button className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800">
                📷
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center pt-8 border-t border-gray-200 text-xs text-gray-500">
          <p>Copyright © 2023 Jaylogic. All Right Reserved</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900">Terms of Service</a>
            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}