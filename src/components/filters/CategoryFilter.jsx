import React, { useState, useEffect } from 'react';
import { useProducts } from '../../contexts/ProductsContext';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import useCategoryTree from '../../hooks/useCategoryTree';

/**
 * Category Filter Component - Now supports hierarchical categories
 */
const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const { categoryTree, loading, getCategoryBreadcrumbs } = useCategoryTree();
  const { categories: legacyCategories } = useProducts();
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  // Use hierarchical tree if available, otherwise fall back to legacy flat list
  const useHierarchical = categoryTree.length > 0;

  // Auto-expand parents when category is selected
  useEffect(() => {
    if (selectedCategory && useHierarchical) {
      const breadcrumbs = getCategoryBreadcrumbs(selectedCategory);
      const parentIds = breadcrumbs.slice(0, -1).map(b => b._id);
      setExpandedCategories(prev => new Set([...prev, ...parentIds]));
    }
  }, [selectedCategory, getCategoryBreadcrumbs, useHierarchical]);

  const toggleExpand = (categoryId, e) => {
    e.stopPropagation();
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleSelect = (category) => {
    if (onCategoryChange) {
      // For hierarchical, pass the category name for now (backward compat)
      onCategoryChange(typeof category === 'string' ? category : category.name);
    }
  };

  // Render hierarchical category item
  const renderHierarchicalItem = (category, level = 0) => {
    const isExpanded = expandedCategories.has(category._id);
    const hasChildren = category.children && category.children.length > 0;
    const isSelected = selectedCategory === category.name || selectedCategory === category._id;

    return (
      <div key={category._id} className="w-full">
        <div
          className={`flex items-center gap-2 py-2 cursor-pointer transition-all group ${isSelected
            ? 'text-black font-semibold'
            : 'text-gray-600 hover:text-black'
            }`}
          style={{ paddingLeft: `${level * 12}px` }}
          onClick={() => handleSelect(category)}
        >
          {hasChildren && (
            <button
              onClick={(e) => toggleExpand(category._id, e)}
              className="p-0.5 hover:bg-gray-100 rounded transition-colors"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          {!hasChildren && level > 0 && <span className="w-4" />}

          <span className={`text-sm ${level === 0 ? 'font-medium' : ''}`}>
            {category.name}
          </span>

          {category.productsCount > 0 && (
            <span className="text-xs text-gray-400 ml-auto">
              {category.productsCount}
            </span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="transition-all">
            {category.children.map(child => renderHierarchicalItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Legacy flat list rendering
  const renderLegacyList = () => (
    <ul className="space-y-1">
      <li>
        <button
          onClick={() => handleSelect('All')}
          className={`w-full text-left py-2 text-sm transition-colors ${!selectedCategory || selectedCategory === 'All'
            ? 'text-black font-semibold'
            : 'text-gray-600 hover:text-black'
            }`}
        >
          All Categories
        </button>
      </li>
      {legacyCategories?.map((category) => (
        <li key={category.name || category}>
          <button
            onClick={() => handleSelect(category.name || category)}
            className={`w-full text-left py-2 text-sm transition-colors flex items-center justify-between ${selectedCategory === (category.name || category)
              ? 'text-black font-semibold'
              : 'text-gray-600 hover:text-black'
              }`}
          >
            <span>{category.name || category}</span>
            {category.count && (
              <span className="text-xs text-gray-400">{category.count}</span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );

  if (loading) {
    return (
      <div className="space-y-2 animate-pulse">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-8 bg-gray-100 rounded" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h3>

      {/* Selected category chip */}
      {selectedCategory && selectedCategory !== 'All' && (
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white text-xs rounded-full">
            {selectedCategory}
            <button
              onClick={() => handleSelect('All')}
              className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
              aria-label="Clear category filter"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        </div>
      )}

      {useHierarchical ? (
        <div className="space-y-1">
          <div
            className={`flex items-center py-2 cursor-pointer transition-colors ${!selectedCategory || selectedCategory === 'All'
              ? 'text-black font-semibold'
              : 'text-gray-600 hover:text-black'
              }`}
            onClick={() => handleSelect('All')}
          >
            <span className="text-sm font-medium">All Categories</span>
          </div>
          {categoryTree.map(category => renderHierarchicalItem(category))}
        </div>
      ) : (
        renderLegacyList()
      )}
    </div>
  );
};



export default CategoryFilter;
