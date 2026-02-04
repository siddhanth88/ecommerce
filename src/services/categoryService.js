import api from './api';

const categoryService = {
  /**
   * Get all categories (flat list)
   * @param {Object} params - Query parameters (level, parentId)
   */
  getAll: async (params = {}) => {
    const response = await api.get('/categories', { params });
    return response.data;
  },

  /**
   * Get category tree (hierarchical structure)
   */
  getTree: async () => {
    const response = await api.get('/categories/tree');
    return response.data;
  },

  /**
   * Get main categories (level 1)
   */
  getMainCategories: async () => {
    const response = await api.get('/categories/main');
    return response.data;
  },

  /**
   * Get single category by ID or slug
   * @param {string} idOrSlug - Category ID or slug
   */
  getById: async (idOrSlug) => {
    const response = await api.get(`/categories/${idOrSlug}`);
    return response.data;
  },

  /**
   * Get children of a category
   * @param {string} parentId - Parent category ID
   */
  getChildren: async (parentId) => {
    const response = await api.get(`/categories/${parentId}/children`);
    return response.data;
  }
};

export default categoryService;
