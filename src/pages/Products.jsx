import React, { useState, useEffect } from 'react';
import { useProducts } from '../contexts/ProductsContext';
import ProductCard from '../components/product/ProductCard';
import SearchBar from '../components/filters/SearchBar';
import SortDropdown from '../components/filters/SortDropdown';
import CategoryFilter, { BrandFilter } from '../components/filters/CategoryFilter';
import PriceRangeFilter from '../components/filters/PriceRangeFilter';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Products = () => {
  const {
    filteredProducts,
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    priceRange,
    pagination
  } = useProducts();

  const [favorites, setFavorites] = useLocalStorage('favorites', []);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters.page]);

  const handleToggleFavorite = (productId) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const activeFiltersCount =
    (filters.category !== 'All' ? 1 : 0) +
    filters.brands.length +
    (filters.search ? 1 : 0) +
    (filters.minPrice !== priceRange.min || filters.maxPrice !== priceRange.max ? 1 : 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Products Section */}
      <section className="products-section py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Search and Sort */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  {filters.category === 'All' ? 'All Products' : filters.category}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded hover:border-gray-400 transition-colors text-sm"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                <SortDropdown
                  value={filters.sortBy}
                  onChange={(value) => updateFilter('sortBy', value)}
                />
              </div>
            </div>

            {/* Search Bar */}
            <SearchBar
              value={filters.search}
              onChange={(value) => updateFilter('search', value)}
            />

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500">Active filters:</span>
                {filters.category !== 'All' && (
                  <span className="inline-flex items-center gap-1 bg-black text-white px-3 py-1 rounded-full text-xs">
                    {filters.category}
                    <button onClick={() => updateFilter('category', 'All')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.brands.map(brand => (
                  <span key={brand} className="inline-flex items-center gap-1 bg-black text-white px-3 py-1 rounded-full text-xs">
                    {brand}
                    <button onClick={() => updateFilter('brands', filters.brands.filter(b => b !== brand))}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.search && (
                  <span className="inline-flex items-center gap-1 bg-black text-white px-3 py-1 rounded-full text-xs">
                    Search: "{filters.search}"
                    <button onClick={() => updateFilter('search', '')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="text-xs text-gray-500 hover:text-black transition-colors underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Main Content: Filters + Products Grid */}
          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6">
              <CategoryFilter
                selectedCategory={filters.category}
                onCategoryChange={(category) => updateFilter('category', category)}
              />

              <div className="border-t border-gray-200 pt-6">
                <BrandFilter
                  selectedBrands={filters.brands}
                  onBrandsChange={(brands) => updateFilter('brands', brands)}
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <PriceRangeFilter
                  minPrice={filters.minPrice}
                  maxPrice={filters.maxPrice}
                  onPriceChange={(min, max) => updateFilters({ minPrice: min, maxPrice: max })}
                  absoluteMin={priceRange.min}
                  absoluteMax={priceRange.max}
                />
              </div>

              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="w-full py-2 text-sm text-gray-600 hover:text-black border border-gray-300 rounded hover:border-black transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  <LoadingSkeleton variant="product-card" count={8} />
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      isFavorite={favorites.includes(product._id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg mb-2">No products found</p>
                  <p className="text-gray-400 text-sm mb-6">
                    Try adjusting your filters or search query
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  <button
                    onClick={() => updateFilter('page', pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 border border-gray-300 rounded hover:border-black disabled:opacity-50 disabled:hover:border-gray-300 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {[...Array(pagination.pages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => updateFilter('page', pageNum)}
                        className={`w-10 h-10 border rounded text-sm font-medium transition-colors ${pagination.page === pageNum
                          ? 'bg-black text-white border-black'
                          : 'border-gray-300 hover:border-black'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => updateFilter('page', pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="p-2 border border-gray-300 rounded hover:border-black disabled:opacity-50 disabled:hover:border-gray-300 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <CategoryFilter
                selectedCategory={filters.category}
                onCategoryChange={(category) => updateFilter('category', category)}
              />

              <div className="border-t border-gray-200 pt-6">
                <BrandFilter
                  selectedBrands={filters.brands}
                  onBrandsChange={(brands) => updateFilter('brands', brands)}
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <PriceRangeFilter
                  minPrice={filters.minPrice}
                  maxPrice={filters.maxPrice}
                  onPriceChange={(min, max) => updateFilters({ minPrice: min, maxPrice: max })}
                  absoluteMin={priceRange.min}
                  absoluteMax={priceRange.max}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-3 text-sm border border-gray-300 rounded hover:border-black transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 py-3 text-sm bg-black text-white rounded hover:bg-gray-800 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
