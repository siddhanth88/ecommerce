import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

/**
 * Hierarchical Category Filter Component
 * Displays categories in an accordion tree structure
 * 
 * @param {Object} props
 * @param {Array} props.categoryTree - Hierarchical category tree
 * @param {string} props.selectedCategoryId - Currently selected category ID
 * @param {Function} props.onCategoryChange - Category selection handler
 * @param {boolean} props.loading - Loading state
 */
const HierarchicalCategoryFilter = ({
    categoryTree = [],
    selectedCategoryId,
    onCategoryChange,
    loading = false
}) => {
    const [expandedCategories, setExpandedCategories] = useState(new Set());

    // Auto-expand parent categories when a child is selected
    useEffect(() => {
        if (selectedCategoryId && categoryTree.length > 0) {
            const findParentPath = (tree, targetId, path = []) => {
                for (const cat of tree) {
                    if (cat._id === targetId) {
                        return path;
                    }
                    if (cat.children?.length > 0) {
                        const result = findParentPath(cat.children, targetId, [...path, cat._id]);
                        if (result) return result;
                    }
                }
                return null;
            };

            const parentPath = findParentPath(categoryTree, selectedCategoryId);
            if (parentPath) {
                setExpandedCategories(prev => new Set([...prev, ...parentPath]));
            }
        }
    }, [selectedCategoryId, categoryTree]);

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

    const handleCategorySelect = (category) => {
        if (onCategoryChange) {
            onCategoryChange(category);
        }
    };

    const renderCategoryItem = (category, level = 0) => {
        const isExpanded = expandedCategories.has(category._id);
        const hasChildren = category.children && category.children.length > 0;
        const isSelected = selectedCategoryId === category._id;

        return (
            <div key={category._id} className="w-full">
                <div
                    className={`flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all group ${isSelected
                            ? 'bg-black text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                    style={{ paddingLeft: `${12 + level * 16}px` }}
                    onClick={() => handleCategorySelect(category)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleCategorySelect(category);
                        }
                    }}
                >
                    {hasChildren && (
                        <button
                            onClick={(e) => toggleExpand(category._id, e)}
                            className={`p-0.5 rounded transition-colors ${isSelected ? 'hover:bg-white/20' : 'hover:bg-gray-200'
                                }`}
                            aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        >
                            {isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                            ) : (
                                <ChevronRight className="w-4 h-4" />
                            )}
                        </button>
                    )}

                    {!hasChildren && <span className="w-5" />}

                    <span className={`flex-1 text-sm font-medium ${level === 0 ? 'font-semibold' : ''}`}>
                        {category.name}
                    </span>

                    {category.productsCount > 0 && (
                        <span className={`text-xs ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                            ({category.productsCount})
                        </span>
                    )}
                </div>

                {/* Children */}
                {hasChildren && isExpanded && (
                    <div className="overflow-hidden animate-slideDown">
                        {category.children.map(child => renderCategoryItem(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="space-y-2 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-10 bg-gray-100 rounded-lg" />
                ))}
            </div>
        );
    }

    if (categoryTree.length === 0) {
        return (
            <div className="text-sm text-gray-500 text-center py-4">
                No categories available
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {/* All Categories option */}
            <div
                className={`flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all ${!selectedCategoryId
                        ? 'bg-black text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                onClick={() => handleCategorySelect(null)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCategorySelect(null);
                    }
                }}
            >
                <span className="w-5" />
                <span className="flex-1 text-sm font-semibold">All Categories</span>
            </div>

            {/* Category tree */}
            {categoryTree.map(category => renderCategoryItem(category))}
        </div>
    );
};

export default HierarchicalCategoryFilter;

/* Add this to your index.css or tailwind.config.js for the animation */
/*
@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 500px;
  }
}

.animate-slideDown {
  animation: slideDown 0.2s ease-out forwards;
}
*/
