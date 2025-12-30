import React from 'react';
import { X } from 'lucide-react';

export default function LoginModal({ loginOpen, setLoginOpen }) {
  if (!loginOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/50" onClick={() => setLoginOpen(false)}></div>
      <div className="relative bg-white shadow-2xl p-8 w-full max-w-md rounded-lg">
        <button 
          onClick={() => setLoginOpen(false)}
          className="absolute top-6 right-6"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-8">SIGN IN</h3>
        
        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900"
          />
          <input 
            type="password" 
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900"
          />
          <button className="w-full py-3 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-all">
            SIGN IN
          </button>
          
          <div className="text-center text-gray-500 text-sm">or</div>
          
          <button className="w-full py-3 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-all">
            CREATE ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );
}