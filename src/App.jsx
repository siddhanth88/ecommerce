import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProductsProvider } from './contexts/ProductsContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import ScrollToTop from './components/common/ScrollToTop';
import { ToastContainer } from './components/common/Toast';
import { useCart } from './contexts/CartContext';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy load page components
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Checkout = lazy(() => import('./pages/Checkout'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const Wishlist = lazy(() => import('./pages/Wishlist'));

// Lazy load admin components
const Dashboard = lazy(() => import('./admin/pages/Dashboard'));
const ProductsList = lazy(() => import('./admin/pages/ProductsList'));
const ProductForm = lazy(() => import('./admin/pages/ProductForm'));
const OrdersList = lazy(() => import('./admin/pages/OrdersList'));
const UsersList = lazy(() => import('./admin/pages/UsersList'));

// Loading Fallback Component
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
    <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
    <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">Loading Experience</p>
  </div>
);

// Toast Container Wrapper
const ToastWrapper = () => {
  const { toast } = useCart();
  return <ToastContainer toast={toast} />;
};

// Main Layout Component for User Pages
const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <AuthProvider>
          <ProductsProvider>
            <CartProvider>
              <WishlistProvider>
                <div className="min-h-screen bg-white flex flex-col">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* Public & User Routes */}
                      <Route element={<MainLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/checkout" element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        } />
                        <Route path="/my-orders" element={
                          <ProtectedRoute>
                            <MyOrders />
                          </ProtectedRoute>
                        } />
                        <Route path="/wishlist" element={<Wishlist />} />
                      </Route>

                      {/* Admin Routes */}
                      <Route path="/admin" element={
                        <AdminRoute>
                          <Dashboard />
                        </AdminRoute>
                      } />
                      <Route path="/admin/products" element={
                        <AdminRoute>
                          <ProductsList />
                        </AdminRoute>
                      } />
                      <Route path="/admin/products/new" element={
                        <AdminRoute>
                          <ProductForm />
                        </AdminRoute>
                      } />
                      <Route path="/admin/products/edit/:id" element={
                        <AdminRoute>
                          <ProductForm />
                        </AdminRoute>
                      } />
                      <Route path="/admin/orders" element={
                        <AdminRoute>
                          <OrdersList />
                        </AdminRoute>
                      } />
                      <Route path="/admin/users" element={
                        <AdminRoute>
                          <UsersList />
                        </AdminRoute>
                      } />
                    </Routes>
                  </Suspense>
                  <ToastWrapper />
                </div>
              </WishlistProvider>
            </CartProvider>
          </ProductsProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
