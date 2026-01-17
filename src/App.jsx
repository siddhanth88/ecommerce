import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductsProvider } from './contexts/ProductsContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import { ToastContainer } from './components/common/Toast';
import { useCart } from './contexts/CartContext';

// Toast Container Wrapper
const ToastWrapper = () => {
  const { toast } = useCart();
  return <ToastContainer toast={toast} />;
};

// Main App Component
function App() {
  return (
    <Router>
      <ProductsProvider>
        <CartProvider>
          <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
              </Routes>
            </main>
            <Footer />
            <ToastWrapper />
          </div>
        </CartProvider>
      </ProductsProvider>
    </Router>
  );
}

export default App;
