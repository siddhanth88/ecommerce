import React, { createContext, useContext, useState, useEffect } from 'react';
import productsData from '../data/products.json';
import { applyFilters, getPriceRange } from '../utils/filterProducts';

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState(productsData.products);
  const [categories, setCategories] = useState(['All', ...productsData.categories]);
  const [brands, setBrands] = useState(productsData.brands);
  const [config, setConfig] = useState(productsData.config);

  // Filters state
  const [filters, setFilters] = useState({
    category: 'All',
    brands: [],
    minPrice: 0,
    maxPrice: 1000,
    search: '',
    sortBy: ''
  });

  // Get price range from all products
  const priceRange = getPriceRange(products);

  // Initialize price range
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      minPrice: priceRange.min,
      maxPrice: priceRange.max
    }));
  }, []);

  // Get filtered products
  const filteredProducts = applyFilters(products, filters);

  // Update filter
  const updateFilter = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Update multiple filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: 'All',
      brands: [],
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      search: '',
      sortBy: ''
    });
  };

  // Get product by ID
  const getProductById = (id) => {
    return products.find(product => product.id === id);
  };

  // Get related products (same category, excluding current product)
  const getRelatedProducts = (productId, limit = 4) => {
    const product = getProductById(productId);
    if (!product) return [];

    return products
      .filter(p => p.category === product.category && p.id !== productId)
      .slice(0, limit);
  };

  // Get products by category
  const getProductsByCategory = (category) => {
    if (category === 'All') return products;
    return products.filter(p => p.category === category);
  };

  // Get products by tag
  const getProductsByTag = (tag) => {
    return products.filter(p => p.tags.includes(tag));
  };

  const value = {
    products,
    filteredProducts,
    categories,
    brands,
    config,
    filters,
    priceRange,
    updateFilter,
    updateFilters,
    resetFilters,
    getProductById,
    getRelatedProducts,
    getProductsByCategory,
    getProductsByTag
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export default ProductsContext;
