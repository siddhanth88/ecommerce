import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import productService from '../services/productService';
import useCategoryTree from '../hooks/useCategoryTree';
import ProductCard from '../components/product/ProductCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

/**
 * Women's Landing Page
 */
const WomenLanding = () => {
    const { categoryTree } = useCategoryTree();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSubCategory, setActiveSubCategory] = useState(null);

    const womenCategory = categoryTree.find(cat => cat.name.toLowerCase() === 'women');
    const subCategories = womenCategory?.children || [];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
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
        setActiveSubCategory(activeSubCategory === subCat ? null : subCat);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Banner */}
            <div className="relative h-[50vh] min-h-[400px] bg-gradient-to-r from-pink-900 to-rose-600 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&h=1080&fit=crop')"
                    }}
                />
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-white px-4 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">WOMEN</h1>
                    <p className="text-xl md:text-2xl font-light mb-8 max-w-2xl">
                        Discover elegance and style in our women's collection
                    </p>
                    <Link
                        to="/products?category=Women"
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
                    <span className="text-black font-medium">Women</span>
                </nav>
            </div>

            {/* Subcategory Navigation */}
            <div className="border-b border-gray-200 sticky top-0 bg-white z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-8 overflow-x-auto scrollbar-hide">
                        <button
                            onClick={() => setActiveSubCategory(null)}
                            className={`py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${!activeSubCategory
                                    ? 'border-pink-600 text-pink-600'
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
                                        ? 'border-pink-600 text-pink-600'
                                        : 'border-transparent text-gray-500 hover:text-black'
                                    }`}
                            >
                                {subCat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Category Cards */}
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
                                    src={subCat.image || `https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop`}
                                    alt={subCat.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute bottom-4 left-4 right-4 z-20">
                                    <h3 className="text-white font-bold text-lg">{subCat.name}</h3>
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
                        to={`/products?category=${activeSubCategory || 'Women'}`}
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
        </div>
    );
};

export default WomenLanding;
