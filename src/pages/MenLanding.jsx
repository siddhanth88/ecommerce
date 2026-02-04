import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import productService from '../services/productService';
import useCategoryTree from '../hooks/useCategoryTree';
import ProductCard from '../components/product/ProductCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

/**
 * Men's Landing Page
 * Displays hero banner, subcategory navigation, and product grid
 */
const MenLanding = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { categoryTree, getCategoryById } = useCategoryTree();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSubCategory, setActiveSubCategory] = useState(null);

    // Find the Men category in the tree
    const menCategory = categoryTree.find(cat => cat.name.toLowerCase() === 'men');
    const subCategories = menCategory?.children || [];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Get products from Men's category
                // For now, filter by category name since products use string categories
                const response = await productService.getAll({
                    category: activeSubCategory || undefined,
                    limit: 12
                });
                setProducts(response.products || []);
            } catch (err) {
                console.error('Failed to fetch products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [activeSubCategory]);

    const handleSubCategoryClick = (subCat) => {
        if (activeSubCategory === subCat) {
            setActiveSubCategory(null);
        } else {
            setActiveSubCategory(subCat);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Banner */}
            <div className="relative h-[50vh] min-h-[400px] bg-gradient-to-r from-gray-900 to-gray-700 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1920&h=1080&fit=crop')"
                    }}
                />
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-white px-4 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">MEN</h1>
                    <p className="text-xl md:text-2xl font-light mb-8 max-w-2xl">
                        Discover the latest trends in men's fashion
                    </p>
                    <Link
                        to="/products?category=Men"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Shop All
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <nav className="flex items-center gap-2 text-sm text-gray-500">
                    <Link to="/" className="hover:text-black transition-colors">Home</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-black font-medium">Men</span>
                </nav>
            </div>

            {/* Subcategory Navigation Tabs */}
            <div className="border-b border-gray-200 sticky top-0 bg-white z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-8 overflow-x-auto scrollbar-hide">
                        <button
                            onClick={() => setActiveSubCategory(null)}
                            className={`py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${!activeSubCategory
                                    ? 'border-black text-black'
                                    : 'border-transparent text-gray-500 hover:text-black'
                                }`}
                        >
                            All
                        </button>
                        {subCategories.map(subCat => (
                            <button
                                key={subCat._id}
                                onClick={() => handleSubCategoryClick(subCat.name)}
                                className={`py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeSubCategory === subCat.name
                                        ? 'border-black text-black'
                                        : 'border-transparent text-gray-500 hover:text-black'
                                    }`}
                            >
                                {subCat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Category Cards (if no subcategory selected) */}
            {!activeSubCategory && subCategories.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {subCategories.map(subCat => (
                            <button
                                key={subCat._id}
                                onClick={() => handleSubCategoryClick(subCat.name)}
                                className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                <img
                                    src={subCat.image || `https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&h=400&fit=crop`}
                                    alt={subCat.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute bottom-4 left-4 right-4 z-20">
                                    <h3 className="text-white font-bold text-lg">{subCat.name}</h3>
                                    {subCat.children?.length > 0 && (
                                        <p className="text-white/80 text-sm mt-1">
                                            {subCat.children.length} subcategories
                                        </p>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Featured Products */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">
                        {activeSubCategory || 'Featured Products'}
                    </h2>
                    <Link
                        to={`/products?category=${activeSubCategory || 'Men'}`}
                        className="text-sm font-medium text-gray-600 hover:text-black transition-colors flex items-center gap-1"
                    >
                        View All
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {[...Array(8)].map((_, i) => (
                            <LoadingSkeleton key={i} variant="product-card" />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        No products found in this category
                    </div>
                )}
            </div>

            {/* Newsletter Banner */}
            <div className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                        Subscribe to our newsletter for exclusive offers and the latest trends
                    </p>
                    <form className="flex max-w-md mx-auto gap-3">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                        />
                        <button
                            type="submit"
                            className="px-8 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MenLanding;
