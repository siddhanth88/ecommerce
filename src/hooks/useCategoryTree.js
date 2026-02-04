import { useState, useEffect, useCallback } from 'react';
import categoryService from '../services/categoryService';

/**
 * Custom hook for fetching and managing category tree
 */
export const useCategoryTree = () => {
  const [categoryTree, setCategoryTree] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategoryTree = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoryService.getTree();
      setCategoryTree(response.tree || []);
      
      // Extract main categories (level 1)
      const main = response.tree?.filter(cat => cat.level === 1) || [];
      setMainCategories(main);
    } catch (err) {
      console.error('Failed to fetch category tree:', err);
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChildren = useCallback(async (parentId) => {
    try {
      const response = await categoryService.getChildren(parentId);
      return response.children || [];
    } catch (err) {
      console.error('Failed to fetch category children:', err);
      return [];
    }
  }, []);

  const getCategoryById = useCallback((categoryId) => {
    const findInTree = (categories) => {
      for (const cat of categories) {
        if (cat._id === categoryId) return cat;
        if (cat.children?.length > 0) {
          const found = findInTree(cat.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findInTree(categoryTree);
  }, [categoryTree]);

  const getCategoryBreadcrumbs = useCallback((categoryId) => {
    const breadcrumbs = [];
    
    const findPath = (categories, targetId, path = []) => {
      for (const cat of categories) {
        const currentPath = [...path, { _id: cat._id, name: cat.name, slug: cat.slug }];
        
        if (cat._id === targetId) {
          return currentPath;
        }
        
        if (cat.children?.length > 0) {
          const result = findPath(cat.children, targetId, currentPath);
          if (result) return result;
        }
      }
      return null;
    };
    
    return findPath(categoryTree, categoryId) || [];
  }, [categoryTree]);

  useEffect(() => {
    fetchCategoryTree();
  }, [fetchCategoryTree]);

  return {
    categoryTree,
    mainCategories,
    loading,
    error,
    refresh: fetchCategoryTree,
    fetchChildren,
    getCategoryById,
    getCategoryBreadcrumbs
  };
};

export default useCategoryTree;
