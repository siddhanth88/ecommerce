import api from './api';

/**
 * Product Service
 */
export const productService = {
  // Get all products with filters
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.category && filters.category !== 'All') {
      params.append('category', filters.category);
    }
    if (filters.categoryId) {
      params.append('categoryId', filters.categoryId);
    }
    if (filters.subCategoryId) {
      params.append('subCategoryId', filters.subCategoryId);
    }

    if (filters.minPrice) {
      params.append('minPrice', filters.minPrice);
    }
    if (filters.maxPrice) {
      params.append('maxPrice', filters.maxPrice);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.sortBy) {
      params.append('sortBy', filters.sortBy);
    }
    if (filters.page) {
      params.append('page', filters.page);
    }
    if (filters.limit) {
      params.append('limit', filters.limit);
    }

    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  // Get single product by ID
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get products by category
  getByCategory: async (category) => {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },

  // Search products
  search: async (query, page = 1, limit = 10) => {
    const response = await api.get(`/products/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    return response.data;
  },

  // Create product (Admin only)
  create: async (productData) => {
    const config = productData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const response = await api.post('/products', productData, config);
    return response.data;
  },

  // Update product (Admin only)
  update: async (id, productData) => {
    const config = productData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const response = await api.put(`/products/${id}`, productData, config);
    return response.data;
  },

  // Delete product (Admin only)
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Update size stock (Admin only)
  updateSizeStock: async (id, size, stock) => {
    const response = await api.post(`/products/${id}/size/${size}/update-stock`, { stock });
    return response.data;
  },

  // Update size price (Admin only)
  updateSizePrice: async (id, size, price) => {
    const response = await api.post(`/products/${id}/size/${size}/update-price`, { price });
    return response.data;
  },

  // Get low stock sizes (Admin only)
  getLowStockSizes: async (id, threshold) => {
    const response = await api.get(`/products/${id}/low-stock-sizes?threshold=${threshold}`);
    return response.data;
  }
};

export default productService;
