import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import productService from '../../services/productService';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { ChevronLeft, Plus, X } from 'lucide-react';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    originalPrice: '',
    discount: 0,
    category: '',
    description: '',
    stock: '',
    images: [''],
    sizes: [],
    colors: [],
    colorNames: [], // Not implementing robust color name mapping in this simple form for now, just keeping structure
    tags: [],
    isActive: true
  });

  const categories = ["T-Shirts", "Hoodies", "Jackets", "Pants", "Shoes", "Accessories"];
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "7", "8", "9", "10", "11", "12", "One Size"];

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const data = await productService.getById(id);
          const product = data.product;
          setFormData({
            ...product,
            price: product.price || '',
            originalPrice: product.originalPrice || '',
            stock: product.stock || '',
            images: product.images.length ? product.images : [''],
             // Ensure arrays are initialized
            sizes: product.sizes || [],
            colors: product.colors || [],
            tags: product.tags || []
          });
        } catch (error) {
          console.error('Failed to fetch product', error);
          alert('Failed to load product details');
          navigate('/admin/products');
        } finally {
          setFetching(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (index, value, field) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (index, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const toggleSize = (size) => {
    setFormData(prev => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean up data
      const dataToSubmit = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        stock: Number(formData.stock),
        discount: Number(formData.discount),
        images: formData.images.filter(img => img.trim() !== ''),
        colors: formData.colors.filter(c => c.trim() !== ''),
        colorNames: formData.colors.filter(c => c.trim() !== '') // Simply mapping hex to name for now as placeholder
      };

      if (isEditMode) {
        await productService.update(id, dataToSubmit);
      } else {
        await productService.create(dataToSubmit);
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to save product', error);
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="h-screen flex items-center justify-center"><Loader /></div>;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/admin/products')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-8">
          
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input
                  type="text"
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Pricing & Stock</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price ($)</label>
                <input
                  type="number"
                  name="originalPrice"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                />
              </div>
              
              <div className="flex items-center">
                 <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Active Product</span>
                 </label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Images</h3>
            <div className="space-y-2">
              {formData.images.map((url, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'images')}
                    placeholder="Image URL"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'images')}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('images')}
                className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Image URL</span>
              </button>
            </div>
          </div>

          {/* Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Variants</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Sizes</label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${
                      formData.sizes.includes(size)
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Colors (Hex Codes)</label>
              <div className="space-y-2">
                {formData.colors.map((color, index) => (
                   <div key={index} className="flex space-x-2">
                     <div className="w-10 h-10 border rounded shadow-sm" style={{ backgroundColor: color }}></div>
                     <input
                       type="text"
                       value={color}
                       onChange={(e) => handleArrayChange(index, e.target.value, 'colors')}
                       placeholder="#000000"
                       className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                     />
                     <button
                       type="button"
                       onClick={() => removeArrayItem(index, 'colors')}
                       className="p-2 text-red-500 hover:bg-red-50 rounded"
                     >
                       <X className="w-5 h-5" />
                     </button>
                   </div>
                ))}
                 <button
                  type="button"
                  onClick={() => addArrayItem('colors')}
                  className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Color</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="min-w-[150px]"
            >
              {isEditMode ? 'Update Product' : 'Create Product'}
            </Button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
};

export default ProductForm;
