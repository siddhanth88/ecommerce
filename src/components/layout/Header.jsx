import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, Heart, LogOut, Package } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../contexts/ProductsContext';
import { useAuth } from '../../contexts/AuthContext';
import CartDrawer from '../cart/CartDrawer';

const Header = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { itemCount } = useCart();
  const { updateFilter, config } = useProducts();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchValue = e.target.search.value;
    updateFilter('search', searchValue);
    setSearchOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-black text-white py-2 px-4 text-center text-xs sm:text-sm font-medium tracking-widest">
        GET 10% OFF ON YOUR FIRST ORDER • USE CODE: WELCOME10
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-sm font-medium hover:text-gray-600 transition-colors">
                Shop
              </Link>
              <Link to="/" className="text-sm font-medium hover:text-gray-600 transition-colors">
                New Arrivals
              </Link>
              <Link to="/" className="text-sm font-medium hover:text-gray-600 transition-colors">
                Collections
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden p-2 -ml-2"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Center Logo */}
            <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
              {config.logo ? (
                <img 
                  src={config.logo} 
                  alt={config.storeName} 
                  className="h-8 md:h-10 object-contain"
                />
              ) : (
                <h1 className="text-2xl font-bold tracking-tighter">{config.storeName}</h1>
              )}
            </Link>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 hover:bg-gray-50 rounded-full"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCartOpen(true)}
                className="p-2 hover:bg-gray-50 rounded-full relative"
                aria-label="Shopping cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {itemCount}
                  </span>
                )}
              </button>
              {user ? (
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Hi, {user.name.split(' ')[0]}</span>
                  <Link 
                    to="/my-orders" 
                    className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                    aria-label="My Orders"
                    title="My Orders"
                  >
                    <Package className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-600 hover:text-red-600"
                    aria-label="Logout"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-1">
                  <Link
                    to="/login"
                    state={{ from: location }}
                    className="text-sm font-medium hover:text-gray-600 px-3 py-2"
                    aria-label="Login"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    state={{ from: location }}
                    className="text-sm font-medium bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                    aria-label="Register"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="py-4 border-t border-gray-100">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-2xl font-bold">{config.storeName}</h2>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="space-y-6">
              {['Shop', 'New Arrivals', 'Collections', 'About', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="block text-xl font-medium hover:text-gray-600 py-2"
                >
                  {item}
                </Link>
              ))}
              {user && (
                <Link
                  to="/my-orders"
                  onClick={() => setMenuOpen(false)}
                  className="block text-xl font-medium hover:text-gray-600 py-2"
                >
                  My Orders
                </Link>
              )}
            </nav>

            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="flex space-x-6">
                <button className="p-2" aria-label="Search">
                  <Search className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setCartOpen(true);
                    setMenuOpen(false);
                  }}
                  className="p-2"
                  aria-label="Shopping cart"
                >
                  <ShoppingBag className="w-5 h-5" />
                </button>
                <button className="p-2" aria-label="Account">
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
