import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProductsProvider } from './contexts/ProductsContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import ProtectedRoute from './components/common/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';
import { ToastContainer } from './components/common/Toast';
import { useCart } from './contexts/CartContext';

import Dashboard from './admin/pages/Dashboard';
import ProductsList from './admin/pages/ProductsList';
import ProductForm from './admin/pages/ProductForm';
import OrdersList from './admin/pages/OrdersList';
import UsersList from './admin/pages/UsersList';
import AdminRoute from './components/common/AdminRoute';

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
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
            <div className="min-h-screen bg-white flex flex-col">
               <Routes>
                  {/* Public & User Routes */}
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
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
              
              <ToastWrapper />
            </div>
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
