import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage({ setCurrentPage }) {
  return (
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Contact Us</h2>
        <div className="grid md:grid-cols-2 gap-12 mb-8">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Mail className="w-6 h-6 text-gray-900 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Email</h3>
                <p className="text-gray-600">hello@stuffsus.com</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Phone className="w-6 h-6 text-gray-900 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Phone</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-gray-900 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Address</h3>
                <p className="text-gray-600">123 Fashion Street, New York, NY 10001</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900"
            />
            <input 
              type="email" 
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900"
            />
            <textarea 
              placeholder="Message"
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900"
            ></textarea>
            <button className="w-full py-3 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-all">
              SEND MESSAGE
            </button>
          </div>
        </div>
        <button 
          onClick={() => setCurrentPage('home')}
          className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
        >
          BACK TO SHOP
        </button>
      </div>
    </div>
  );
}