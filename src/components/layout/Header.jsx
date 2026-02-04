import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Heart, User2Icon, ChevronLeft } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../contexts/ProductsContext';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishlistContext';
import CartDrawer from '../cart/CartDrawer';
import GlobalSearch from '../GlobalSearch';
import HierarchicalCategoryFilter from '../filters/HierarchicalCategoryFilter';
import useCategoryTree from '../../hooks/useCategoryTree';

const Header = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { filters, updateFilters, config } = useProducts();
  const { user, logout } = useAuth();
  const { wishlistIds } = useWishlist();
  const navigate = useNavigate();
  const { categoryTree: tree, loading: categoriesLoading } = useCategoryTree();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#282c3f] text-white py-1.5 px-4 text-center text-xs font-medium tracking-widest uppercase">
        Flat ₹500 OFF on your first order • Use Code: MYNTRA500
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm h-20">
        <div className="max-w-[1400px] mx-auto px-4 h-full flex items-center justify-between">

          {/* Left: Menu + Logo + Main Nav */}
          <div className="flex items-center space-x-4 sm:space-x-8 h-full">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 group"
              aria-label="Open categories menu"
            >
              <Menu className="w-5 h-5 text-gray-700" />
              <span className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-black transition-colors">Categories</span>
            </button>

            <Link to="/" className="flex-shrink-0">
              {config.logo ? (
                <img
                  src={config.logo}
                  alt={config.storeName}
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter text-[#282c3f]">{config.storeName}</h1>
              )}
            </Link>

            {/* Main Navigation - Desktop Only */}
            <nav className="hidden lg:flex items-center h-full space-x-6">
              {tree?.slice(0, 6).map(cat => (
                <div key={cat._id} className="relative group h-full flex items-center px-2">
                  <Link
                    to={`/products?categoryId=${cat._id}`}
                    className="text-sm font-bold text-[#282c3f] hover:border-b-4 hover:border-[#ff3f6c] h-full flex items-center transition-all uppercase tracking-tight"
                  >
                    {cat.name}
                  </Link>

                  {/* Mega Menu */}
                  {cat.children && cat.children.length > 0 && (
                    <div className="absolute left-[-100px] top-full w-[800px] bg-white shadow-xl border-t border-gray-100 hidden group-hover:block z-50 animate-fade-in">
                      <div className="p-8 grid grid-cols-4 gap-8">
                        {cat.children.map(l2 => (
                          <div key={l2._id}>
                            <h3 className="text-[#ff3f6c] text-sm font-bold mb-3 uppercase">{l2.name}</h3>
                            <div className="flex flex-col space-y-1.5">
                              {l2.children?.map(l3 => (
                                <Link
                                  key={l3._id}
                                  to={`/products?categoryId=${cat._id}&subCategoryId=${l3._id}`}
                                  className="text-[13px] text-gray-600 hover:text-black hover:font-bold transition-all"
                                >
                                  {l3.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Middle: Search Bar */}
          <div className="flex-1 max-w-lg px-8 hidden md:flex">
            <GlobalSearch />
          </div>

          {/* Right: Icons */}
          <div className="flex items-center space-x-6">
            {/* Profile */}
            <div className="relative group/profile flex flex-col items-center cursor-pointer">
              <User2Icon className="w-5 h-5 text-gray-700 group-hover:text-black transition-colors" />
              <span className="hidden sm:block text-[10px] font-bold text-gray-700 mt-1 uppercase">Profile</span>

              {/* Profile Dropdown */}
              <div className="absolute right-0 top-full pt-4 hidden group-hover/profile:block w-64 z-50">
                <div className="bg-white shadow-xl border border-gray-100 p-5 rounded-sm">
                  {user ? (
                    <>
                      <div className="mb-4">
                        <p className="font-bold text-sm text-gray-800">Hello {user.name.split(' ')[0]}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <hr className="my-3" />
                      <div className="space-y-3">
                        <Link to="/my-orders" className="block text-sm text-gray-700 hover:font-bold">Orders</Link>
                        <Link to="/wishlist" className="block text-sm text-gray-700 hover:font-bold">Wishlist</Link>
                        <Link to="/profile" className="block text-sm text-gray-700 hover:font-bold">Edit Profile</Link>
                        <hr />
                        <button onClick={handleLogout} className="text-sm font-bold text-red-600 hover:tracking-wider transition-all">Logout</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-sm mb-1">Welcome</p>
                      <p className="text-xs text-gray-500 mb-4">To access account and orders</p>
                      <Link to="/login" className="inline-block border border-gray-200 px-4 py-2 text-sm font-bold text-[#ff3f6c] hover:border-[#ff3f6c] transition-colors uppercase">Login / Signup</Link>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className="flex flex-col items-center group">
              <div className="relative">
                <Heart className="w-5 h-5 text-gray-700 group-hover:text-red-500 transition-colors" />
                {wishlistIds.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff3f6c] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {wishlistIds.length}
                  </span>
                )}
              </div>
              <span className="hidden sm:block text-[10px] font-bold text-gray-700 mt-1 uppercase">Wishlist</span>
            </Link>

            {/* Bag */}
            <button onClick={() => setCartOpen(true)} className="flex flex-col items-center group">
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-gray-700 group-hover:text-black transition-colors" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff3f6c] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:block text-[10px] font-bold text-gray-700 mt-1 uppercase">Bag</span>
            </button>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Mobile/Sidebar Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />

          <div className="relative h-full w-[85%] max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white text-black sticky top-0 z-10">
              <h2 className="text-lg font-bold uppercase tracking-widest">{config.storeName}</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto bg-white scrollbar-hide">
              <div className="p-4">
                <div className="mb-6">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-3">Shop by Category</h3>
                  <HierarchicalCategoryFilter
                    categoryTree={tree}
                    selectedCategoryId={filters.subCategoryId || filters.categoryId}
                    loading={categoriesLoading}
                    onCategoryChange={(cat) => {
                      if (!cat) {
                        updateFilters({ category: 'All', categoryId: '', subCategoryId: '' });
                      } else if (cat.level === 3) {
                        updateFilters({ category: cat.name, subCategoryId: cat._id });
                      } else if (cat.level === 2) {
                        updateFilters({ category: cat.name, subCategoryId: cat._id });
                      } else {
                        updateFilters({ category: cat.name, categoryId: cat._id, subCategoryId: '' });
                      }
                      setMenuOpen(false);
                      navigate('/products');
                    }}
                  />
                </div>

                {/* Additional Links */}
                <div className="pt-6 border-t border-gray-100 space-y-1">
                  {!user && (
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-4 px-3 text-sm font-bold text-[#ff3f6c] hover:bg-gray-50 rounded-lg">Login / Signup</Link>
                  )}
                  <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="block py-4 px-3 text-sm font-medium hover:bg-gray-50 rounded-lg">Orders</Link>
                  <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="block py-4 px-3 text-sm font-medium hover:bg-gray-50 rounded-lg">Wishlist</Link>
                  {user && (
                    <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full text-left py-4 px-3 text-sm font-bold text-red-600 hover:bg-gray-50 rounded-lg">Logout</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
