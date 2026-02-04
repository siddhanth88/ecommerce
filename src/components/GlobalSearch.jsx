import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, ArrowRight, Hash, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { useDebounce } from '../hooks/useDebounce';
import { formatPrice } from '../utils/formatPrice';

export default function GlobalSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [currentPage, setCurrentPage] = useState(1);

    const debouncedQuery = useDebounce(query, 300); // Slightly faster debounce
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const inputRef = useRef(null);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search effect
    useEffect(() => {
        if (debouncedQuery.trim().length > 0) {
            handleSearch(1);
        } else {
            setResults([]);
            setPagination({ page: 1, pages: 1, total: 0 });
        }
    }, [debouncedQuery]);

    // Pagination effect
    useEffect(() => {
        if (debouncedQuery.trim().length > 0 && currentPage !== pagination.page) {
            handleSearch(currentPage);
        }
    }, [currentPage]);

    const handleSearch = async (page) => {
        setIsLoading(true);
        try {
            const data = await productService.search(debouncedQuery, page, 6);
            setResults(data.products || []);
            setPagination({
                page: data.page,
                pages: data.pages,
                total: data.total
            });
            setCurrentPage(data.page);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectResult = (productId) => {
        navigate(`/product/${productId}`);
        setQuery('');
        setResults([]);
        setIsFocused(false);
    };

    const handleFullSearch = (e) => {
        if (e) e.preventDefault();
        if (query.trim()) {
            navigate(`/products?q=${encodeURIComponent(query)}`);
            setQuery('');
            setResults([]);
            setIsFocused(false);
        }
    };

    return (
        <div className="relative w-full max-w-lg" ref={searchRef}>
            {/* Search Bar Container */}
            <div className={`flex items-center bg-gray-100 rounded border transition-all duration-200 ${isFocused ? 'bg-white border-gray-300 ring-4 ring-gray-100' : 'border-transparent'}`}>
                <div className="pl-3 text-gray-400">
                    <Search className="w-4 h-4" />
                </div>

                <form onSubmit={handleFullSearch} className="flex-1 flex items-center">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search for products, brands and more"
                        value={query}
                        onFocus={() => setIsFocused(true)}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 text-sm py-2 px-3 lg:py-2.5 placeholder:text-gray-500"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => { setQuery(''); setResults([]); }}
                            className="p-1 px-3 hover:text-black text-gray-400 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </form>
            </div>

            {/* Results Dropdown */}
            {isFocused && (query.trim().length > 0 || isLoading) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-1 duration-200">

                    {/* Header */}
                    <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Hash className="w-3 h-3" />
                            {isLoading ? 'Searching...' : pagination.total > 0 ? `${pagination.total} Matching Products` : 'No Results Found'}
                        </span>
                        {isLoading && <Loader2 className="w-3 h-3 animate-spin text-gray-400" />}
                    </div>

                    {/* Results List */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {isLoading && results.length === 0 ? (
                            <div className="p-8 flex flex-col items-center justify-center gap-2">
                                <Loader2 className="w-6 h-6 animate-spin text-gray-200" />
                                <p className="text-xs text-gray-400">Fetching results...</p>
                            </div>
                        ) : results.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {results.map((product) => (
                                    <button
                                        key={product._id}
                                        onClick={() => handleSelectResult(product._id)}
                                        className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors text-left group"
                                    >
                                        <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden border border-gray-200">
                                            {product.imageDataArray?.[0] ? (
                                                <img
                                                    src={product.imageDataArray[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <Search className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 truncate">
                                                {product.name}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs font-bold text-black">{formatPrice(product.price)}</span>
                                                {product.originalPrice > product.price && (
                                                    <span className="text-[10px] text-gray-400 line-through">
                                                        {formatPrice(product.originalPrice)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-200 group-hover:text-black group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        ) : !isLoading && (
                            <div className="p-10 text-center">
                                <p className="text-sm font-medium text-gray-500">No products found for "{query}"</p>
                                <p className="text-xs text-gray-400 mt-1">Try another keyword</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination Footer */}
                    {pagination.pages > 1 && (
                        <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex gap-2">
                                <button
                                    disabled={currentPage === 1 || isLoading}
                                    onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => Math.max(1, prev - 1)); }}
                                    className="p-1 hover:bg-white rounded border border-gray-200 disabled:opacity-30 transition-all"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    disabled={currentPage === pagination.pages || isLoading}
                                    onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => Math.min(pagination.pages, prev + 1)); }}
                                    className="p-1 hover:bg-white rounded border border-gray-200 disabled:opacity-30 transition-all"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            <span className="text-[10px] font-bold text-gray-400 uppercase">
                                Page {currentPage} of {pagination.pages}
                            </span>

                            <button
                                onClick={handleFullSearch}
                                className="text-[10px] font-bold text-black hover:underline underline-offset-4"
                            >
                                VIEW ALL
                            </button>
                        </div>
                    )}

                    {pagination.total > 0 && pagination.pages === 1 && (
                        <button
                            onClick={handleFullSearch}
                            className="w-full py-2.5 bg-gray-50 text-[10px] font-bold text-gray-500 hover:text-black hover:bg-white transition-all border-t border-gray-100 flex items-center justify-center gap-2"
                        >
                            SEE ALL RESULTS FOR "{query.toUpperCase()}" <ArrowRight className="w-3 h-3" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
