import React, { useState } from 'react';
import { ShoppingBag, Search, User, Heart, Menu, X, ChevronRight } from 'lucide-react';

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState(new Set());

  const products = [
    { 
      id: 1, 
      name: 'Premium Hoodie', 
      price: 89.90, 
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
      category: 'Hoodies',
      tags: ['Best Seller']
    },
    { 
      id: 2, 
      name: 'Oversized T-Shirt', 
      price: 39.90, 
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
      category: 'T-Shirts',
      tags: ['New']
    },
    { 
      id: 3, 
      name: 'Leather Jacket', 
      price: 199.00, 
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
      category: 'Jackets',
      tags: ['Luxury']
    },
    { 
      id: 4, 
      name: 'Cargo Pants', 
      price: 79.90, 
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop',
      category: 'Pants',
      tags: ['Trending']
    },
    { 
      id: 5, 
      name: 'Baseball Cap', 
      price: 29.90, 
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=500&fit=crop',
      category: 'Accessories',
      tags: ['New']
    },
    { 
      id: 6, 
      name: 'Canvas Sneakers', 
      price: 69.90, 
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop',
      category: 'Shoes',
      tags: ['Essential']
    },
  ];

  const categories = [
    { name: 'All', count: products.length },
    { name: 'Hoodies', count: 1 },
    { name: 'T-Shirts', count: 1 },
    { name: 'Jackets', count: 1 },
    { name: 'Pants', count: 1 },
    { name: 'Shoes', count: 1 },
    { name: 'Accessories', count: 1 },
  ];

  const collections = [
    { name: 'New Arrivals', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=700&fit=crop' },
    { name: 'Best Sellers', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=700&fit=crop' },
    { name: 'Summer Collection', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=700&fit=crop' },
  ];

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, change) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleNavigation = (section) => {
    switch(section) {
      case 'Shop':
        document.querySelector('.products-section')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'New Arrivals':
        setSelectedCategory('All');
        document.querySelector('.products-section')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'Collections':
        document.querySelector('.collections-section')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'About':
        document.querySelector('.footer-section')?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        break;
    }
    setMenuOpen(false);
  };

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Announcement Bar */}
      <div className="bg-black text-white py-2 px-4 text-center text-xs sm:text-sm font-medium tracking-widest">
        GET 10% OFF ON YOUR FIRST ORDER • USE CODE: WELCOME10
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => handleNavigation('Shop')}
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                Shop
              </button>
              <button 
                onClick={() => handleNavigation('New Arrivals')}
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                New Arrivals
              </button>
              <button 
                onClick={() => handleNavigation('Collections')}
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                Collections
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMenuOpen(true)}
              className="md:hidden p-2 -ml-2"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Center Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-2xl font-bold tracking-tighter">BLINK</h1>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-50 rounded-full">
                <Search className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setCartOpen(true)}
                className="p-2 hover:bg-gray-50 rounded-full relative"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {cartItems.length}
                  </span>
                )}
              </button>
              <button className="hidden md:flex items-center space-x-1 text-sm font-medium hover:text-gray-600">
                <User className="w-4 h-4" />
                <span>Account</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[70vh] sm:h-[80vh] bg-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1920&h=1080&fit=crop&q=80"
            alt="Hero"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full">
            <div className="max-w-2xl">
              <div className="text-xs sm:text-sm font-medium tracking-[0.3em] text-white/70 mb-4">
                THE ULTIMATE STREETWEAR COLLECTION
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-none">
                LAYERS<br />
                FOR THE<br />
                CITY
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/80 mb-8 max-w-xl">
                Minimal essentials crafted for urban living. Quality streetwear designed for everyday comfort and style.
              </p>
              <button 
                onClick={() => handleNavigation('Shop')}
                className="bg-white text-black px-8 sm:px-10 py-3 sm:py-4 text-xs sm:text-sm font-medium tracking-wider hover:bg-gray-100 transition-all duration-300"
              >
                SHOP NOW
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 border-b border-gray-100 bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-6 sm:space-x-12 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex flex-col items-center space-y-1 group min-w-max ${
                  selectedCategory === category.name ? 'text-black' : 'text-gray-500'
                }`}
              >
                <span className={`text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 ${
                  selectedCategory === category.name ? 'border-b-2 border-black pb-1' : 'group-hover:text-gray-900'
                }`}>
                  {category.name.toUpperCase()}
                </span>
                <span className="text-xs text-gray-400">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid - Smaller Size */}
      <section className="products-section py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group relative">
                <div className="overflow-hidden bg-gray-50 aspect-[3/4] mb-3 relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Tags */}
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                    {product.tags.map((tag) => (
                      <span key={tag} className="bg-white text-black px-2 py-1 text-[10px] sm:text-xs font-medium block mb-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full py-2 sm:py-2.5 bg-white text-black text-xs sm:text-sm font-medium tracking-wide hover:bg-gray-100 transition-colors"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-sm sm:text-base">{product.name}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">${product.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="p-1.5 hover:bg-gray-100 rounded-full"
                  >
                    <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${favorites.has(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="collections-section py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">COLLECTIONS</h2>
            <p className="text-gray-600 text-sm sm:text-base">Explore our curated collections</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {collections.map((collection, index) => (
              <div key={index} className="group relative overflow-hidden">
                <img 
                  src={collection.image} 
                  alt={collection.name}
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{collection.name}</h3>
                  <button className="flex items-center text-white text-xs sm:text-sm font-medium hover:text-gray-200">
                    SHOP NOW
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 sm:py-20 bg-black text-white">
        <div className="max-w-2xl mx-auto text-center px-4 sm:px-6">
          <h3 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">STAY UPDATED</h3>
          <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
            Subscribe for exclusive offers and early access to new collections.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 sm:px-6 py-3 bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:border-white text-sm"
            />
            <button 
              className="bg-white text-black px-6 sm:px-8 py-3 font-medium tracking-wider hover:bg-gray-100 transition-colors whitespace-nowrap text-sm"
            >
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section py-10 sm:py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">BLINK</h2>
            <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base">
              Minimal streetwear essentials for urban living.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-6 sm:mb-8">
            <button 
              onClick={() => handleNavigation('Shop')}
              className="text-sm font-medium hover:text-gray-600"
            >
              Shop
            </button>
            <button 
              onClick={() => handleNavigation('New Arrivals')}
              className="text-sm font-medium hover:text-gray-600"
            >
              New Arrivals
            </button>
            <button 
              onClick={() => handleNavigation('Collections')}
              className="text-sm font-medium hover:text-gray-600"
            >
              Collections
            </button>
            <button 
              onClick={() => handleNavigation('About')}
              className="text-sm font-medium hover:text-gray-600"
            >
              About
            </button>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm font-medium hover:text-gray-600"
            >
              Contact
            </button>
          </div>

          <div className="text-center pt-6 sm:pt-8 border-t border-gray-100">
            <p className="text-xs sm:text-sm text-gray-500">© 2024 BLINK. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCartOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold">SHOPPING BAG</h3>
                <button onClick={() => setCartOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-2">Your bag is empty</p>
                  <button 
                    onClick={() => setCartOpen(false)}
                    className="text-sm font-medium hover:text-gray-600"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto space-y-6">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex gap-4">
                        <img src={item.image} alt={item.name} className="w-20 h-28 object-cover" />
                        <div className="flex-1">
                          <h4 className="font-medium mb-1 text-sm">{item.name}</h4>
                          <p className="text-gray-600 mb-2 text-sm">${item.price.toFixed(2)}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-6 h-6 border rounded flex items-center justify-center hover:bg-gray-50"
                              >
                                -
                              </button>
                              <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-6 h-6 border rounded flex items-center justify-center hover:bg-gray-50"
                              >
                                +
                              </button>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-gray-900"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-6 space-y-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>TOTAL</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <button className="w-full py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors">
                      CHECKOUT
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-2xl font-bold">BLINK</h2>
              <button onClick={() => setMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="space-y-6">
              {['Shop', 'New Arrivals', 'Collections', 'About', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavigation(item)}
                  className="block text-xl font-medium hover:text-gray-600 py-2 w-full text-left"
                >
                  {item}
                </button>
              ))}
            </nav>
            
            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="flex space-x-6">
                <button className="p-2">
                  <Search className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => {
                    setCartOpen(true);
                    setMenuOpen(false);
                  }}
                  className="p-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                </button>
                <button className="p-2">
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}