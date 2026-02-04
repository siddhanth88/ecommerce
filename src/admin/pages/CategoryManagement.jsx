import React, { useState, useEffect } from 'react';
import {
    Plus,
    Edit2,
    Trash2,
    ChevronRight,
    ChevronDown,
    Folder,
    Layers,
    Image as ImageIcon,
    AlertCircle
} from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';
import categoryService from '../../services/categoryService';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [parentCategory, setParentCategory] = useState(null);
    const [expandedNodes, setExpandedNodes] = useState(new Set());

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        parentId: null
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryService.getTree();
            setCategories(data.tree);

            // Expand level 1 by default
            const level1 = data.tree.map(cat => cat._id);
            setExpandedNodes(new Set(level1));
        } catch (error) {
            console.error('Failed to fetch categories', error);
            setError('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const toggleNode = (nodeId) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(nodeId)) {
            newExpanded.delete(nodeId);
        } else {
            newExpanded.add(nodeId);
        }
        setExpandedNodes(newExpanded);
    };

    const handleOpenModal = (type, category = null, parent = null) => {
        setError(null);
        if (type === 'edit') {
            setEditingCategory(category);
            setParentCategory(null);
            setFormData({
                name: category.name,
                image: category.image || '',
                parentId: category.parentId
            });
        } else if (type === 'add-sub') {
            setEditingCategory(null);
            setParentCategory(parent);
            setFormData({
                name: '',
                image: '',
                parentId: parent._id
            });
        } else {
            // Add root
            setEditingCategory(null);
            setParentCategory(null);
            setFormData({
                name: '',
                image: '',
                parentId: null
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            if (editingCategory) {
                await categoryService.update(editingCategory._id, formData);
            } else {
                await categoryService.create(formData);
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save category');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (category) => {
        if (category.children && category.children.length > 0) {
            alert('Cannot delete category with subcategories. Delete children first.');
            return;
        }

        if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
            try {
                await categoryService.delete(category._id);
                fetchCategories();
            } catch (err) {
                alert(err.response?.data?.error || 'Failed to delete category');
            }
        }
    };

    const renderCategoryNode = (category, level = 0) => {
        const isExpanded = expandedNodes.has(category._id);
        const hasChildren = category.children && category.children.length > 0;

        return (
            <div key={category._id} className="select-none">
                <div
                    className={`group flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors border-l-2 ${level === 0 ? 'border-black' : level === 1 ? 'border-blue-400' : 'border-gray-200'
                        } mb-1 ml-${level * 6}`}
                    style={{ marginLeft: `${level * 24}px` }}
                >
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => toggleNode(category._id)}
                            className={`p-1 hover:bg-gray-200 rounded transition-colors ${!hasChildren && 'invisible'}`}
                        >
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        <div className={`p-2 rounded ${level === 0 ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                            {level === 0 ? <Folder className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                        </div>
                        <div>
                            <span className="font-semibold text-gray-900">{category.name}</span>
                            {category.productsCount !== undefined && (
                                <span className="ml-2 text-xs text-gray-500">
                                    {category.productsCount} products
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {level < 2 && (
                            <button
                                onClick={() => handleOpenModal('add-sub', null, category)}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                title="Add Subcategory"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={() => handleOpenModal('edit', category)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(category)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {hasChildren && isExpanded && (
                    <div className="mt-1">
                        {category.children.map(child => renderCategoryNode(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter">CATEGORY MANAGEMENT</h1>
                    <p className="text-gray-500 mt-1">Organize your store hierarchy (Max 3 levels)</p>
                </div>
                <button
                    onClick={() => handleOpenModal('add-root')}
                    className="bg-black text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                    <Plus className="w-5 h-5 font-bold" />
                    <span className="font-bold uppercase tracking-widest text-xs">Add Main Category</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader />
                        <p className="text-gray-400 mt-4 animate-pulse uppercase tracking-widest text-xs font-bold">Fetching Tree</p>
                    </div>
                ) : categories.length > 0 ? (
                    <div className="space-y-2">
                        {categories.map(cat => renderCategoryNode(cat))}
                    </div>
                ) : (
                    <div className="text-center py-20 grayscale opacity-50">
                        <Layers className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 font-bold uppercase tracking-widest">No categories found</p>
                        <button
                            onClick={() => handleOpenModal('add-root')}
                            className="mt-4 text-black font-bold underline hover:no-underline"
                        >
                            Create your first category
                        </button>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCategory ? 'Edit Category' : parentCategory ? `Add Subcategory to ${parentCategory.name}` : 'Add Main Category'}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 text-sm animate-shake">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Category Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-black outline-none transition-all font-medium"
                            placeholder="e.g. Menswear, T-Shirts, etc."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Image URL (Optional)</label>
                        <div className="relative">
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-100 focus:border-black outline-none transition-all font-medium"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        {formData.image && (
                            <div className="mt-4 rounded-xl overflow-hidden border-2 border-gray-100 h-32 w-full">
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://placehold.co/400x200?text=Invalid+Image+URL'} />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-100 font-bold hover:bg-gray-50 transition-all uppercase tracking-widest text-xs"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-6 py-3 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-all disabled:opacity-50 uppercase tracking-widest text-xs shadow-lg active:scale-95"
                        >
                            {submitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
};

export default CategoryManagement;
