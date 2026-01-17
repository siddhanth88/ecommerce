import React, { createContext, useContext, useState, useEffect } from 'react';
import productService from '../services/productService';
import productsData from '../data/products.json'; // Fallback for config

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState(['All', ...productsData.categories]);
  const [brands, setBrands] = useState(productsData.brands);
  const [config, setConfig] = useState(productsData.config);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    category: 'All',
    brands: [],
    minPrice: 0,
    maxPrice: 1000,
    search: '',
    sortBy: '',
    page: 1,
    limit: 12
  });

  // Price range
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAll(filters);
      
      setFilteredProducts(data.products || []);
      
      // If it's the first load, also set all products for price range calculation
      if (products.length === 0) {
        const allData = await productService.getAll({ limit: 1000 });
        setProducts(allData.products || []);
        
        // Calculate price range
        if (allData.products && allData.products.length > 0) {
          const prices = allData.products.map(p => p.price);
          const min = Math.floor(Math.min(...prices));
          const max = Math.ceil(Math.max(...prices));
          setPriceRange({ min, max });
          
          // Update filters with actual price range
          setFilters(prev => ({
            ...prev,
            minPrice: min,
            maxPrice: max
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.error || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters.category, filters.brands, filters.minPrice, filters.maxPrice, filters.search, filters.sortBy, filters.page]);

  // Update filter
  const updateFilter = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
      page: filterName !== 'page' ? 1 : prev.page // Reset to page 1 when filter changes
    }));
  };

  // Update multiple filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to page 1
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
      sortBy: '',
      page: 1,
      limit: 12
    });
  };

  // Get product by ID
  const getProductById = (id) => {
    // First try to find in current products
    const product = products.find(product => product._id === id || product.id === id);
    if (product) return product;
    
    // If not found, try in filtered products
    return filteredProducts.find(product => product._id === id || product.id === id);
  };

  // Get related products (same category, excluding current product)
  const getRelatedProducts = (productId, limit = 4) => {
    const product = getProductById(productId);
    if (!product) return [];

    return products
      .filter(p => p.category === product.category && (p._id !== productId && p.id !== productId))
      .slice(0, limit);
  };

  // Get products by category
  const getProductsByCategory = (category) => {
    if (category === 'All') return products;
    return products.filter(p => p.category === category);
  };

  // Get products by tag
  const getProductsByTag = (tag) => {
    return products.filter(p => p.tags && p.tags.includes(tag));
  };

  const value = {
    products,
    filteredProducts,
    categories,
    brands,
    config,
    filters,
    priceRange,
    loading,
    error,
    updateFilter,
    updateFilters,
    resetFilters,
    getProductById,
    getRelatedProducts,
    getProductsByCategory,
    getProductsByTag,
    refetch: fetchProducts
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export default ProductsContext;

