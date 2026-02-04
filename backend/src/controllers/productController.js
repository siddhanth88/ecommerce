import Product from '../models/Product.js';
import Category from '../models/Category.js';

/**
 * @desc    Get all products with filtering, sorting, and pagination
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      categoryId,
      subCategoryId,

      minPrice,
      maxPrice,
      search,
      sortBy,
      page = 1,
      limit = 12
    } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    // Build query
    let query = { isActive: true };

    // Category filter (legacy - string category name)
    if (category && category !== 'All') {
      query.category = category;
    }

    // Hierarchical Category filtering
    if (categoryId || subCategoryId) {
      const baseId = subCategoryId || categoryId;
      
      // Better way than recursion: Get all categories once or use Category.find
      // For now, keep the helper but make sure it's reliable
      const getDescendantIds = async (parentId) => {
        try {
          const children = await Category.find({ parentId }).select('_id');
          let ids = [parentId];
          for (const child of children) {
            const childIds = await getDescendantIds(child._id);
            ids = [...ids, ...childIds];
          }
          return ids;
        } catch (e) {
          console.error('[BACKEND] Error in getDescendantIds:', e);
          return [parentId];
        }
      };

      const allTargetIds = await getDescendantIds(baseId);
      const categoryQuery = {
        $or: [
          { categoryId: { $in: allTargetIds } },
          { subCategoryId: { $in: allTargetIds } }
        ]
      };

      // Combine with existing query
      if (query.$or) {
        // If we already have an $or (unlikely at this point, but safe), we might need $and
        query = { $and: [query, categoryQuery] };
      } else {
        Object.assign(query, categoryQuery);
      }
    }



    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search filter
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      const searchQuery = {
        $or: [
          { name: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { category: { $regex: searchRegex } }
        ]
      };

      if (query.$and) {
        query.$and.push(searchQuery);
      } else if (query.$or) {
        // If we have category filter (which uses $or), wrap both in $and
        const catQuery = { $or: query.$or };
        delete query.$or;
        query.$and = [catQuery, searchQuery];
      } else {
        Object.assign(query, searchQuery);
      }
    }

    // Sorting
    let sortOptions = {};
    switch (sortBy) {
      case 'price-low-high':
        sortOptions = { price: 1 };
        break;
      case 'price-high-low':
        sortOptions = { price: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'popular':
        sortOptions = { reviews: -1 };
        break;
      case 'rating':
        sortOptions = { rating: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Pagination
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skip);

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products: products.map(product => {
        const productObj = product.toObject();
        if (product.imagesData && product.imagesData.length > 0) {
          productObj.imageDataArray = product.imagesData.map(img => 
            `data:${img.contentType};base64,${img.buffer.toString('base64')}`
          );
        }
        return productObj;
      })
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const productObj = product.toObject();
    if (product.imagesData && product.imagesData.length > 0) {
      productObj.imageDataArray = product.imagesData.map(img => 
        `data:${img.contentType};base64,${img.buffer.toString('base64')}`
      );
    }

    res.status(200).json({
      success: true,
      product: productObj
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get products by category
 * @route   GET /api/products/category/:category
 * @access  Public
 */
export const getProductsByCategory = async (req, res, next) => {
  try {
    const products = await Product.find({
      category: req.params.category,
      isActive: true
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products: products.map(product => {
        const productObj = product.toObject();
        if (product.imagesData && product.imagesData.length > 0) {
          productObj.imageDataArray = product.imagesData.map(img => 
            `data:${img.contentType};base64,${img.buffer.toString('base64')}`
          );
        }
        return productObj;
      })
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search products
 * @route   GET /api/products/search
 * @access  Public
 */
export const searchProducts = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Please provide search query'
      });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const searchRegex = new RegExp(q, 'i');
    const searchQuery = {
      $or: [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { category: { $regex: searchRegex } }
      ],
      isActive: true
    };

    const total = await Product.countDocuments(searchQuery);
    const products = await Product.find(searchQuery)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      products: products.map(product => {
        const productObj = product.toObject();
        if (product.imagesData && product.imagesData.length > 0) {
          productObj.imageDataArray = product.imagesData.map(img => 
            `data:${img.contentType};base64,${img.buffer.toString('base64')}`
          );
        }
        return productObj;
      })
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (req, res, next) => {
  try {
    const productData = { ...req.body };

    // Parse size_variants if it's a string (from FormData)
    if (typeof productData.size_variants === 'string') {
      try {
        productData.size_variants = JSON.parse(productData.size_variants);
      } catch (e) {
        console.error('Failed to parse size_variants', e);
      }
    }

    // Parse colorVariants if it's a string (from FormData)
    if (typeof productData.colorVariants === 'string') {
      try {
        productData.colorVariants = JSON.parse(productData.colorVariants);
      } catch (e) {
        console.error('Failed to parse colorVariants', e);
      }
    }

    // Process uploaded files
    if (req.files && req.files.length > 0) {
      const globalImagesData = []; // For legacy/main images

      req.files.forEach(file => {
        // Check if file belongs to a specific color variant
        // Expected fieldname format: "variant_0_image", "variant_1_image", etc.
        const variantMatch = file.fieldname.match(/^variant_(\d+)_image/);

        if (variantMatch && productData.colorVariants && Array.isArray(productData.colorVariants)) {
          const index = parseInt(variantMatch[1]);
          if (productData.colorVariants[index]) {
            if (!productData.colorVariants[index].images) {
              productData.colorVariants[index].images = [];
            }
            // Add as data URI string
            const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            productData.colorVariants[index].images.push(base64);
          }
        } else if (file.fieldname === 'images') {
           // Main product images (legacy)
           globalImagesData.push({
             buffer: file.buffer,
             contentType: file.mimetype
           });
        }
      });

      if (globalImagesData.length > 0) {
        productData.imagesData = globalImagesData;
      }
    }

    // Calculate initial total stock
    // Priority: colorVariants with sizes > size_variants > manual stock
    if (productData.colorVariants && Array.isArray(productData.colorVariants) && productData.colorVariants.some(c => c.sizes && c.sizes.length > 0)) {
       let total = 0;
       productData.colorVariants.forEach(c => {
         if (c.sizes) {
           c.sizes.forEach(s => total += (Number(s.stock) || 0));
         }
       });
       productData.stock = total;
    } else if (productData.size_variants) {
      let totalStock = 0;
      Object.values(productData.size_variants).forEach(v => {
        totalStock += Number(v.stock) || 0;
      });
      productData.stock = totalStock;
    }

    const product = new Product(productData);
    console.log('[DEBUG] Final Product object before save:', JSON.stringify(product.toObject(), null, 2));
    await product.save();

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const updateData = { ...req.body };

    // Parse size_variants if it's a string (from FormData)
    if (typeof updateData.size_variants === 'string') {
      try {
        updateData.size_variants = JSON.parse(updateData.size_variants);
      } catch (e) {
        console.error('Failed to parse size_variants', e);
      }
    }

    // Parse colorVariants if it's a string (from FormData)
    if (typeof updateData.colorVariants === 'string') {
      try {
        updateData.colorVariants = JSON.parse(updateData.colorVariants);
      } catch (e) {
        console.error('Failed to parse colorVariants', e);
      }
    }

    // Process uploaded files for update
    if (req.files && req.files.length > 0) {
       const globalImagesData = [];

       req.files.forEach(file => {
        const variantMatch = file.fieldname.match(/^variant_(\d+)_image/);

        if (variantMatch && updateData.colorVariants && Array.isArray(updateData.colorVariants)) {
          const index = parseInt(variantMatch[1]);
          if (updateData.colorVariants[index]) {
            if (!updateData.colorVariants[index].images) {
              updateData.colorVariants[index].images = [];
            }
            const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            updateData.colorVariants[index].images.push(base64);
          }
        } else if (file.fieldname === 'images') {
           globalImagesData.push({
             buffer: file.buffer,
             contentType: file.mimetype
           });
        }
      });
      
      // Only update main images if new ones are provided
      if (globalImagesData.length > 0) {
        updateData.imagesData = globalImagesData;
      }
    }

    // Recalculate total stock
    if (updateData.colorVariants && Array.isArray(updateData.colorVariants) && updateData.colorVariants.some(c => c.sizes && c.sizes.length > 0)) {
       let total = 0;
       updateData.colorVariants.forEach(c => {
         if (c.sizes) {
           c.sizes.forEach(s => total += (Number(s.stock) || 0));
         }
       });
       updateData.stock = total;
    } else if (updateData.size_variants) {
      let totalStock = 0;
      Object.values(updateData.size_variants).forEach(v => {
        totalStock += Number(v.stock) || 0;
      });
      updateData.stock = totalStock;
    }

    // Use .set() and .save() for reliable Map updates
    product.set(updateData);
    await product.save();

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update stock for specific size
 * @route   POST /api/products/:id/size/:size/update-stock
 * @access  Private/Admin
 */
export const updateSizeStock = async (req, res, next) => {
  try {
    const { id, size } = req.params;
    const { stock } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    if (!product.size_variants || !product.size_variants.has(size)) {
      return res.status(400).json({ success: false, error: `Size ${size} not found` });
    }

    const variant = product.size_variants.get(size);
    variant.stock = Number(stock);
    product.size_variants.set(size, variant);

    // Recalculate total stock
    let totalStock = 0;
    for (const v of product.size_variants.values()) {
      totalStock += v.stock;
    }
    product.stock = totalStock;

    await product.save();

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update price for specific size
 * @route   POST /api/products/:id/size/:size/update-price
 * @access  Private/Admin
 */
export const updateSizePrice = async (req, res, next) => {
  try {
    const { id, size } = req.params;
    const { price } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    if (!product.size_variants || !product.size_variants.has(size)) {
      return res.status(400).json({ success: false, error: `Size ${size} not found` });
    }

    const variant = product.size_variants.get(size);
    variant.price = Number(price);
    product.size_variants.set(size, variant);

    await product.save();

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get low stock sizes
 * @route   GET /api/products/:id/low-stock-sizes
 * @access  Private/Admin
 */
export const getLowStockSizes = async (req, res, next) => {
  try {
    const { id } = req.params;
    const threshold = Number(req.query.threshold) || 5;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const lowStockSizes = [];
    if (product.size_variants) {
      for (const [size, variant] of product.size_variants.entries()) {
        if (variant.stock < threshold) {
          lowStockSizes.push({ size, stock: variant.stock });
        }
      }
    }

    res.status(200).json({ success: true, lowStockSizes });
  } catch (error) {
    next(error);
  }
};
