/**
 * Filter products by category
 * @param {Array} products - Array of products
 * @param {string} category - Category to filter by
 * @returns {Array} Filtered products
 */
export const filterByCategory = (products, category) => {
  if (!category || category === 'All') return products;
  return products.filter(product => product.category === category);
};

/**
 * Filter products by brand
 * @param {Array} products - Array of products
 * @param {Array} brands - Array of brands to filter by
 * @returns {Array} Filtered products
 */
export const filterByBrand = (products, brands) => {
  if (!brands || brands.length === 0) return products;
  return products.filter(product => brands.includes(product.brand));
};

/**
 * Filter products by price range
 * @param {Array} products - Array of products
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {Array} Filtered products
 */
export const filterByPriceRange = (products, minPrice, maxPrice) => {
  return products.filter(product => 
    product.price >= minPrice && product.price <= maxPrice
  );
};

/**
 * Search products by name or brand
 * @param {Array} products - Array of products
 * @param {string} query - Search query
 * @returns {Array} Filtered products
 */
export const searchProducts = (products, query) => {
  if (!query || query.trim() === '') return products;
  
  const lowerQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowerQuery) ||
    product.brand.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

/**
 * Sort products
 * @param {Array} products - Array of products
 * @param {string} sortBy - Sort criteria
 * @returns {Array} Sorted products
 */
export const sortProducts = (products, sortBy) => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-low-high':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high-low':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      return sorted.reverse(); // Assuming newer products are at the end
    case 'popular':
      return sorted.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    default:
      return sorted;
  }
};

/**
 * Get price range from products
 * @param {Array} products - Array of products
 * @returns {Object} Min and max price
 */
export const getPriceRange = (products) => {
  if (!products || products.length === 0) {
    return { min: 0, max: 1000 };
  }
  
  const prices = products.map(p => p.price);
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices))
  };
};

/**
 * Apply all filters to products
 * @param {Array} products - Array of products
 * @param {Object} filters - Filter object
 * @returns {Array} Filtered and sorted products
 */
export const applyFilters = (products, filters) => {
  let filtered = products;
  
  // Apply category filter
  if (filters.category) {
    filtered = filterByCategory(filtered, filters.category);
  }
  
  // Apply brand filter
  if (filters.brands && filters.brands.length > 0) {
    filtered = filterByBrand(filtered, filters.brands);
  }
  
  // Apply price range filter
  if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
    filtered = filterByPriceRange(filtered, filters.minPrice, filters.maxPrice);
  }
  
  // Apply search
  if (filters.search) {
    filtered = searchProducts(filtered, filters.search);
  }
  
  // Apply sort
  if (filters.sortBy) {
    filtered = sortProducts(filtered, filters.sortBy);
  }
  
  return filtered;
};
