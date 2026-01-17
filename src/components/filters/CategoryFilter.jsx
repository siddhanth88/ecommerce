import React from 'react';
import { X } from 'lucide-react';
import { useProducts } from '../../contexts/ProductsContext';

/**
 * Category Filter Component
 * @param {Object} props
 * @param {string} props.selectedCategory - Currently selected category
 * @param {Function} props.onCategoryChange - Category change handler
 */
const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const { categories, getProductsByCategory } = useProducts();

  const getCategoryCount = (category) => {
    if (category === 'All') {
      return getProductsByCategory('All').length;
    }
    return getProductsByCategory(category).length;
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold tracking-wide">CATEGORIES</h3>
      
      <div className="space-y-1">
        {categories.map((category) => {
          const count = getCategoryCount(category);
          const isSelected = selectedCategory === category;

          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                isSelected
                  ? 'bg-black text-white font-medium'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <span className="flex items-center justify-between">
                <span>{category}</span>
                <span className={`text-xs ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                  ({count})
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Brand Filter Component
 * @param {Object} props
 * @param {Array} props.selectedBrands - Currently selected brands
 * @param {Function} props.onBrandsChange - Brands change handler
 */
export const BrandFilter = ({ selectedBrands, onBrandsChange }) => {
  const { brands } = useProducts();

  const handleToggleBrand = (brand) => {
    if (selectedBrands.includes(brand)) {
      onBrandsChange(selectedBrands.filter(b => b !== brand));
    } else {
      onBrandsChange([...selectedBrands, brand]);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold tracking-wide">BRANDS</h3>
      
      <div className="space-y-2">
        {brands.map((brand) => {
          const isSelected = selectedBrands.includes(brand);

          return (
            <label
              key={brand}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded transition-colors"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggleBrand(brand)}
                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="text-sm text-gray-700">{brand}</span>
            </label>
          );
        })}
      </div>

      {selectedBrands.length > 0 && (
        <button
          onClick={() => onBrandsChange([])}
          className="text-xs text-gray-500 hover:text-black transition-colors flex items-center gap-1"
        >
          <X className="w-3 h-3" />
          Clear all
        </button>
      )}
    </div>
  );
};

export default CategoryFilter;
