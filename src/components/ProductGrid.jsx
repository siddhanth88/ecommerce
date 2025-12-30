import React from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductGrid({ 
  products, 
  selectedCategory, 
  setSelectedCategory, 
  addToCart, 
  toggleFavorite, 
  favorites 
}) {
  const categories = [
    { name: 'All Products', icon: '📦', count: 85 },
    { name: 'For Home', icon: '🏠', count: 0 },
    { name: 'For Music', icon: '🎵', count: 0 },
    { name: 'For Phone', icon: '📱', count: 0 },
    { name: 'For Storage', icon: '💾', count: 0 },
    { name: 'New Arrival', icon: '✨', count: 0 },
    { name: 'Best Seller', icon: '🔥', count: 0 },
    { name: 'On Discount', icon: '💰', count: 0 },
  ];

  const filteredProducts = selectedCategory === 'All Products' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg p-4 sticky top-24">
            <h3 className="text-sm font-semibold mb-4">Category</h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat.name 
                      ? 'bg-black text-white' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </div>
                  {cat.count > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      selectedCategory === cat.name ? 'bg-white text-black' : 'bg-red-100 text-red-600'
                    }`}>
                      {cat.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden group">
                <div className="relative bg-gray-50 aspect-square p-8">
                  <span className="absolute top-3 right-3 bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
                    {product.category}
                  </span>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
                  <div className="flex items-center space-x-1 mb-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600">{product.rating} ({product.reviews} Reviews)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button 
                      onClick={() => addToCart(product)}
                      className="flex-1 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => addToCart(product)}
                      className="flex-1 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between py-8">
            <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, '...', 6, 9, 10].map((page, idx) => (
                <button
                  key={idx}
                  className={`w-8 h-8 rounded-lg text-sm ${
                    page === 1 ? 'bg-black text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Recommendations */}
          <section className="py-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Explore our recommendations</h2>
              <div className="flex gap-2">
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 3).map((product) => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden">
                  <div className="relative bg-gray-50 aspect-square p-8">
                    <span className="absolute top-3 right-3 bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
                      {product.category}
                    </span>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
                    <div className="flex items-center space-x-1 mb-2">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">{product.rating} ({product.reviews} Reviews)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button 
                        onClick={() => addToCart(product)}
                        className="flex-1 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                      >
                        Add to Cart
                      </button>
                      <button 
                        onClick={() => addToCart(product)}
                        className="flex-1 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Newsletter */}
          <section className="bg-gray-900 text-white rounded-2xl p-12 mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">Ready to Get<br />Our New Stuff?</h2>
              <div className="flex gap-3 mt-6">
                <input 
                  type="email" 
                  placeholder="Your Email"
                  className="flex-1 px-4 py-2 bg-white text-gray-900 rounded-lg outline-none"
                />
                <button className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-100">
                  Send
                </button>
              </div>
            </div>
            <div className="mt-8 text-sm text-gray-400">
              <p className="font-semibold text-white mb-2">Stuffsus for Homes and Needs</p>
              <p className="text-xs leading-relaxed max-w-md">
                We'll send you daily updates, identify your best products, and item create a seriously smart EV charging solution that's right for you.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}