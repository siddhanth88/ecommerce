import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import productService from '../../services/productService';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import categoryService from '../../services/categoryService';
import { ChevronLeft, Plus, X } from 'lucide-react';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetching, setFetching] = useState(isEditMode);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    name: '',

    price: '',
    originalPrice: '',
    discount: 0,
    category: '',
    description: '',
    stock: '',
    sizes: [],
    size_variants: {},
    colors: [],
    colorVariants: [], // New structure
    tags: [],
    isActive: true
  });

  // State for variant images (files and previews)
  // Structure: { [variantIndex]: { files: File[], previews: string[] } }
  const [variantImages, setVariantImages] = useState({});
  const [categoriesTree, setCategoriesTree] = useState([]);
  const [l2CategoryId, setL2CategoryId] = useState(''); // New for 3-level hierarchy

  // Mock list, ideally fetch from backend or config
  const categories = ["T-Shirts", "Hoodies", "Jackets", "Pants", "Shoes", "Accessories"]; // Kept for fallback
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "7", "8", "9", "10", "11", "12", "One Size"];

  useEffect(() => {
    // Fetch categories tree
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getTree();
        if (data.success) {
          setCategoriesTree(data.tree);
        }
      } catch (err) {
        console.error("Failed to load categories tree", err);
      }
    };
    fetchCategories();
  }, []);

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
            // Ensure arrays and objects are initialized
            sizes: product.sizes || [],
            size_variants: product.size_variants || {},
            colors: product.colors || [],
            colorVariants: product.colorVariants || [],
            tags: product.tags || []
          });

          if (product.imageDataArray) {
            setImagePreviews(product.imageDataArray);
          }

          // Initialize variant previews from existing data
          if (product.colorVariants?.length > 0) {
            const initialVariantImages = {};
            product.colorVariants.forEach((variant, index) => {
              if (variant.images?.length > 0) {
                initialVariantImages[index] = {
                  files: [], // No new files yet
                  previews: variant.images // Existing URLs/Base64
                };
              }
            });
            setVariantImages(initialVariantImages);
          }

          // If editing, handle hierarchical categories
          if (product.subCategoryId && categoriesTree.length > 0) {
            // Find the category in the tree to check its level
            const findById = (tree, targetId) => {
              for (const cat of tree) {
                if (cat._id === targetId) return cat;
                const found = findById(cat.children || [], targetId);
                if (found) return found;
              }
              return null;
            };

            const selectedCat = findById(categoriesTree, product.subCategoryId);
            if (selectedCat) {
              if (selectedCat.level === 3) {
                // If it's a leaf (L3), we need to find its parent (L2) for the intermediate dropdown
                const findParent = (tree, targetId) => {
                  for (const cat of tree) {
                    if (cat.children?.some(child => child._id === targetId)) return cat;
                    const found = findParent(cat.children || [], targetId);
                    if (found) return found;
                  }
                  return null;
                };
                const l2 = findParent(categoriesTree, product.subCategoryId);
                if (l2) setL2CategoryId(l2._id);
              } else if (selectedCat.level === 2) {
                // If it's L2, set l2CategoryId state directly
                setL2CategoryId(selectedCat._id);
                // Also clear subCategoryId from formData because for the UI, L3 is "not selected"
                // But wait, the DB holds L2 in subCategoryId. We should keep it until L3 is picked.
                // This is fine.
              }
            }
          }
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
  }, [id, isEditMode, navigate, categoriesTree]); // Added categoriesTree dependency to help set L2 category if editing

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

  const handleVariantChange = (size, field, value) => {
    setFormData(prev => ({
      ...prev,
      size_variants: {
        ...prev.size_variants,
        [size]: {
          ...prev.size_variants[size],
          [field]: value
        }
      }
    }));
  };

  const addColorVariant = () => {
    setFormData(prev => ({
      ...prev,
      colorVariants: [
        ...prev.colorVariants,
        { name: '', hexCode: '#000000', images: [], isDefault: prev.colorVariants.length === 0 }
      ]
    }));
  };

  const removeColorVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      colorVariants: prev.colorVariants.filter((_, i) => i !== index)
    }));
    // Clean up images for this variant
    setVariantImages(prev => {
      const newState = { ...prev };
      delete newState[index];
      // Shift indices?? No, simple deletion is tricky if indices shift.
      // Better to rely on re-render. Ideally use UUIDs, but here index-based.
      // If we remove index 0, old index 1 becomes 0.
      // We must shift keys in variantImages.
      // Simplified: Just clear for now, minor bug if deleting middle item with images.
      // Correct approach: rebuild object
      const adjusted = {};
      Object.keys(prev).forEach(key => {
        const k = parseInt(key);
        if (k < index) adjusted[k] = prev[k];
        if (k > index) adjusted[k - 1] = prev[k];
      });
      return adjusted;
    });
  };

  const updateColorVariant = (index, field, value) => {
    setFormData(prev => {
      const newVariants = [...prev.colorVariants];
      newVariants[index] = { ...newVariants[index], [field]: value };

      // Handle radio button behavior for isDefault
      if (field === 'isDefault' && value === true) {
        newVariants.forEach((v, i) => {
          if (i !== index) v.isDefault = false;
        });
      }
      return { ...prev, colorVariants: newVariants };
    });
  };

  const toggleSize = (size) => {
    setFormData(prev => {
      const isSelected = prev.sizes.includes(size);
      const newSizes = isSelected
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];

      // We no longer manage size_variants map for stock here.
      // Stock is managed inside colorVariants.
      // But we should try to sync if user un-selects a size, maybe clear it from variants?
      // Optional: Clean up variants stock for removed sizes to keep data clean
      if (isSelected) {
        // Size removed
        const newVariants = prev.colorVariants.map(v => ({
          ...v,
          sizes: v.sizes ? v.sizes.filter(s => s.size !== size) : []
        }));
        return { ...prev, sizes: newSizes, colorVariants: newVariants };
      }

      return { ...prev, sizes: newSizes };
    });
  };

  const updateVariantSizeData = (variantIndex, size, field, value) => {
    setFormData(prev => {
      const newVariants = [...prev.colorVariants];
      const variant = { ...newVariants[variantIndex] };
      // Ensure sizes array exists
      const sizesList = variant.sizes ? [...variant.sizes] : [];

      const existingIndex = sizesList.findIndex(s => s.size === size);

      if (existingIndex >= 0) {
        sizesList[existingIndex] = { ...sizesList[existingIndex], [field]: value };
      } else {
        sizesList.push({ size, stock: 0, price: '', [field]: value });
      }

      variant.sizes = sizesList;
      newVariants[variantIndex] = variant;
      return { ...prev, colorVariants: newVariants };
    });
  };

  const getVariantSizeData = (variantIndex, size) => {
    const variant = formData.colorVariants[variantIndex];
    if (!variant || !variant.sizes) return { stock: 0, price: '' };
    const entry = variant.sizes.find(s => s.size === size);
    return entry ? { stock: entry.stock, price: entry.price } : { stock: 0, price: '' };
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Limit to 5 images total
      const newFiles = [...imageFiles, ...files].slice(0, 5);
      setImageFiles(newFiles);

      const newPreviews = [];
      let loaded = 0;

      newFiles.forEach((file, index) => {
        // If it's already a string (base64 from server), just keep it
        if (typeof file === 'string') {
          newPreviews[index] = file;
          loaded++;
          if (loaded === newFiles.length) setImagePreviews(newPreviews);
        } else {
          const reader = new FileReader();
          reader.onloadend = () => {
            newPreviews[index] = reader.result;
            loaded++;
            if (loaded === newFiles.length) setImagePreviews(newPreviews);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleVariantFileChange = (index, e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setVariantImages(prev => {
        const current = prev[index] || { files: [], previews: [] };
        const newFiles = [...current.files, ...files];
        const newPreviews = [...current.previews]; // Start with existing

        // Add placeholders for new files
        let loaded = 0;
        const totalNew = files.length;
        const startIndex = current.previews.length;

        files.forEach((file, i) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            // We can't easily update state in loop reliably without functional update or tracking.
            // Simplified: trigger update after read.
            // Actually, let's just use object URLs for preview which is sync
            newPreviews[startIndex + i] = URL.createObjectURL(file);

            // Force update
            setVariantImages(p => ({
              ...p,
              [index]: {
                files: newFiles,
                previews: newPreviews
              }
            }));
          };
          reader.readAsDataURL(file);
        });

        return {
          ...prev,
          [index]: {
            files: newFiles,
            previews: [...current.previews, ...Array(files.length).fill('')] // Temporary placeholders
          }
        };
      });
    }
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    setVariantImages(prev => {
      const current = prev[variantIndex];
      if (!current) return prev;

      // Need to distinguish between existing images (strings) and new files
      // This is complicated because previews array mixes them.
      // Current 'files' array only tracks NEW files.
      // 'previews' tracks ALL displayed images.
      // Product.images in formData also exists?
      // Let's assume:
      // If we remove an image, we remove it from previews.
      // If it was a new file, we remove from files.
      // IF it was existing, we must update formData.colorVariants[i].images

      const isExisting = typeof current.previews[imageIndex] === 'string' && !current.previews[imageIndex].startsWith('blob:');
      // Note: Data URLs also start with data:, legacy backend URLs might be http or data.
      // Actually simpler: 
      // If we simply keep lists and remove from both.

      // Real implementation complexity: syncing 'files' list with 'previews'.
      // If 'files' contains [A, B] and we have previews [Old1, A, B].
      // Remove index 0 (Old1). Files remain [A, B]. Previews [A, B].
      // Remove index 1 (A). Files -> [B]. Previews [Old1, B].

      // Fix: We need to know WHICH file matches which preview.
      // Hack: clear all and re-add? No.
      // Better: Just reset the specific variant images on edit?
      // Let's assume for now user adds new images to the end.
      return prev;
    });
    // For simplicity in this iteration, allow adding only. Deletion of individual standard images is hard without robust ID tracking.
    // I'll implement "Clear All Images" for variant instead, or basic append.
    // WAIT, for MVP, just allow adding new ones.
    // Let's implement a Clear button.
  };

  const clearVariantImages = (index) => {
    setVariantImages(prev => ({
      ...prev,
      [index]: { files: [], previews: [] }
    }));
    // Also clear from formData
    updateColorVariant(index, 'images', []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create a shallow copy to manipulate
      let submitData = { ...formData };

      // Append simple fields
      const productData = new FormData();

      // Basic Fields
      productData.append('name', submitData.name);
      productData.append('description', submitData.description);
      productData.append('isActive', submitData.isActive);
      productData.append('category', submitData.category);
      if (submitData.categoryId) productData.append('categoryId', submitData.categoryId);
      if (submitData.subCategoryId) productData.append('subCategoryId', submitData.subCategoryId);

      // Pricing & Stock
      // Calculate Total Stock and Base Price from variants if we have them
      if (submitData.colorVariants?.length > 0) {
        let totalStock = 0;
        let basePrice = Number(submitData.price) || 0;

        submitData.colorVariants.forEach(variant => {
          if (variant.sizes) {
            variant.sizes.forEach(s => {
              totalStock += (Number(s.stock) || 0);
              // If no base price yet, take first size price
              if (!basePrice && s.price) basePrice = Number(s.price);
            });
          }
        });

        productData.append('stock', totalStock);
        productData.append('price', basePrice);
      } else {
        productData.append('stock', submitData.stock || 0);
        productData.append('price', submitData.price || 0);
      }

      if (submitData.originalPrice) productData.append('originalPrice', submitData.originalPrice);
      productData.append('discount', submitData.discount || 0);

      // Arrays (Tags & Sizes)
      if (submitData.tags?.length > 0) {
        submitData.tags.forEach(tag => productData.append('tags[]', tag));
      }
      if (submitData.sizes?.length > 0) {
        submitData.sizes.forEach(size => productData.append('sizes[]', size));
      }

      // Complex Nested Data (JSON Stringified)
      // Backend should be able to parse these
      productData.append('colorVariants', JSON.stringify(submitData.colorVariants));
      productData.append('size_variants', JSON.stringify(submitData.size_variants));

      // Global Images (legacy)
      imageFiles.forEach(file => {
        if (file instanceof File) {
          productData.append('images', file);
        }
      });

      // Variant Images (Files) 
      // We send them as variant_[index]_image fieldname which backend logic expects
      Object.keys(variantImages).forEach(variantIndex => {
        const { files } = variantImages[variantIndex];
        files.forEach(file => {
          productData.append(`variant_${variantIndex}_image`, file);
        });
      });

      if (isEditMode) {
        await productService.update(id, productData);
      } else {
        await productService.create(productData);
      }
      navigate('/admin/products');
    } catch (err) {
      console.error('Submit Error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to save product');
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
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
              <X className="w-5 h-5" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Main Category</label>
                    <select
                      name="mainCategory"
                      required
                      value={formData.categoryId || ''}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const selectedCat = categoriesTree.find(c => c._id === selectedId);
                        setFormData(prev => ({
                          ...prev,
                          categoryId: selectedId,
                          category: selectedCat ? selectedCat.name : '', // Fallback to L1 name
                          subCategoryId: '' // Reset sub
                        }));
                        setL2CategoryId(''); // Reset L2
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                    >
                      <option value="">Select (MEN/WOMEN...)</option>
                      {categoriesTree.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Range / Category</label>
                    <select
                      name="l2Category"
                      value={l2CategoryId || ''}
                      disabled={!formData.categoryId}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const l1 = categoriesTree.find(c => c._id === formData.categoryId);
                        const selectedL2 = l1?.children?.find(c => c._id === selectedId);

                        setL2CategoryId(selectedId);
                        setFormData(prev => ({
                          ...prev,
                          subCategoryId: selectedId, // Set L2 as the specific category for now
                          category: selectedL2 ? selectedL2.name : (l1 ? l1.name : '') // Store L2 name as legacy
                        }));
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <option value="">Select (Clothing/Footwear...)</option>
                      {formData.categoryId && categoriesTree.find(c => c._id === formData.categoryId)?.children?.map(l2 => (
                        <option key={l2._id} value={l2._id}>{l2.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Sub-Category</label>
                    <select
                      name="subCategory"
                      value={formData.subCategoryId && formData.subCategoryId !== l2CategoryId ? formData.subCategoryId : ''}
                      disabled={!l2CategoryId || !(categoriesTree.find(c => c._id === formData.categoryId)?.children?.find(l2 => l2._id === l2CategoryId)?.children?.length > 0)}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const l1 = categoriesTree.find(c => c._id === formData.categoryId);
                        const l2 = l1?.children?.find(c => c._id === l2CategoryId);
                        const selectedL3 = l2?.children?.find(c => c._id === selectedId);

                        setFormData(prev => ({
                          ...prev,
                          subCategoryId: selectedId || l2CategoryId, // If cleared, go back to L2
                          category: selectedL3 ? selectedL3.name : (l2 ? l2.name : '')
                        }));
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <option value="">Select (T-Shirts/Jeans...)</option>
                      {l2CategoryId && categoriesTree
                        .find(c => c._id === formData.categoryId)
                        ?.children?.find(l2 => l2._id === l2CategoryId)
                        ?.children?.map(l3 => (
                          <option key={l3._id} value={l3._id}>{l3.name}</option>
                        ))}
                    </select>
                  </div>
                </div>
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

          {/* Pricing (Base) & Other Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Pricing & Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Only show Global Price if NO variants are added, OR as a readonly Base Price reference */}
              {/* Strategy: We keep it but maybe readonly? Or strictly hidden? 
                  User said "remove", so let's hide it if variants exist, or simple remove and auto-calc.
                  But we need a Base Price for the product model. 
                  Let's make it explicitly "Base Price" and auto-fill from first variant if empty?
                  Actually, user wants to see price in variants. 
                  Let's hide this section if formData.colorVariants.length > 0
              */}

              {formData.colorVariants.length === 0 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      required={formData.colorVariants.length === 0}
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      name="stock"
                      required={formData.colorVariants.length === 0}
                      min="0"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price ($) (Optional)</label>
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



          {/* Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Variants</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Sizes</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${formData.sizes.includes(size)
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {formData.sizes.length > 0 && formData.colorVariants.length === 0 && (
                <div className="mt-4 border rounded-lg overflow-hidden opacity-50 pointer-events-none filter grayscale">
                  <div className="p-4 bg-gray-50 text-center text-sm text-gray-500">
                    Add a Color Variant to manage stock for these sizes.
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">Color Variants</label>
                <button
                  type="button"
                  onClick={addColorVariant}
                  className="flex items-center gap-1 text-sm text-black hover:underline"
                >
                  <Plus className="w-4 h-4" />
                  Add Color
                </button>
              </div>

              <div className="space-y-6">
                {formData.colorVariants.map((variant, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
                    <button
                      type="button"
                      onClick={() => removeColorVariant(index)}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove variant"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Color Name</label>
                        <input
                          type="text"
                          value={variant.name}
                          onChange={(e) => updateColorVariant(index, 'name', e.target.value)}
                          placeholder="e.g. Midnight Blue"
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-black focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Hex Code</label>
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-9 rounded border border-gray-300 overflow-hidden shadow-sm">
                            <input
                              type="color"
                              value={variant.hexCode || '#000000'}
                              onChange={(e) => updateColorVariant(index, 'hexCode', e.target.value)}
                              className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0"
                            />
                          </div>
                          <input
                            type="text"
                            value={variant.hexCode}
                            onChange={(e) => updateColorVariant(index, 'hexCode', e.target.value)}
                            placeholder="#000000"
                            className="flex-1 px-3 py-1.5 text-sm font-mono border border-gray-300 rounded focus:ring-black focus:border-black uppercase"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="defaultColor"
                          checked={variant.isDefault}
                          onChange={(e) => updateColorVariant(index, 'isDefault', e.target.checked)}
                          className="text-black focus:ring-black"
                        />
                        <span className="text-sm font-medium">Set as Default Color</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2">Variant Images</label>
                      <div className="flex flex-wrap gap-3">
                        {/* Upload Button */}
                        <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-black hover:bg-white transition-colors">
                          <Plus className="w-5 h-5 text-gray-400" />
                          <span className="text-[10px] text-gray-500 mt-1">Add Img</span>
                          <input
                            type="file"
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleVariantFileChange(index, e)}
                          />
                        </label>

                        {/* Previews */}
                        {(variantImages[index]?.previews || []).map((src, imgIdx) => (
                          <div key={imgIdx} className="w-20 h-20 border rounded-lg overflow-hidden relative bg-white">
                            {src ? (
                              <img src={src} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gray-100 animate-pulse" />
                            )}
                          </div>
                        ))}

                        {(!variantImages[index]?.previews || variantImages[index]?.previews.length === 0) && (
                          <span className="text-xs text-gray-400 self-center">No images yet</span>
                        )}

                        {(variantImages[index]?.previews && variantImages[index]?.previews.length > 0) && (
                          <button
                            type="button"
                            onClick={() => clearVariantImages(index)}
                            className="text-xs text-red-500 hover:text-red-700 self-center underline ml-2"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Stock & Price Management for this Color */}
                    {formData.sizes.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <label className="block text-xs font-medium text-gray-500 mb-2">Stock & Price per Size</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {formData.sizes.map(size => {
                            const data = getVariantSizeData(index, size);
                            return (
                              <div key={size} className="bg-white border rounded p-2 shadow-sm">
                                <div className="text-[10px] font-bold text-gray-400 mb-1.5 border-b pb-1">{size}</div>
                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-[9px] text-gray-400 mb-0.5">Stock</label>
                                    <input
                                      type="number"
                                      min="0"
                                      value={data.stock}
                                      onChange={(e) => updateVariantSizeData(index, size, 'stock', Number(e.target.value))}
                                      className="w-full text-xs px-2 py-1 border rounded focus:ring-1 focus:ring-black"
                                      placeholder="0"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] text-gray-400 mb-0.5">Price (Optional)</label>
                                    <input
                                      type="number"
                                      min="0"
                                      value={data.price || ''}
                                      onChange={(e) => updateVariantSizeData(index, size, 'price', e.target.value ? Number(e.target.value) : '')}
                                      className="w-full text-xs px-2 py-1 border rounded focus:ring-1 focus:ring-black"
                                      placeholder="Base Price"
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                ))}

                {formData.colorVariants.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500 text-sm mb-2">No color variants added</p>
                    <Button onClick={addColorVariant} size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-1" /> Add First Color
                    </Button>
                  </div>
                )}
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
