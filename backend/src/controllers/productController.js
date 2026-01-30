import Product from '../models/Product.js';

/**
 * @desc    Get all products with filtering, sorting, and pagination
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      brand,
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

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Brand filter
    if (brand) {
      const brands = Array.isArray(brand) ? brand : [brand];
      query.brand = { $in: brands };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search filter
    if (search) {
      query.$text = { $search: search };
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
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Please provide search query'
      });
    }

    const products = await Product.find({
      $text: { $search: q },
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

    if (req.files && req.files.length > 0) {
      productData.imagesData = req.files.map(file => ({
        buffer: file.buffer,
        contentType: file.mimetype
      }));
    }

    // Calculate initial total stock if size_variants provided
    if (productData.size_variants) {
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

    if (req.files && req.files.length > 0) {
      updateData.imagesData = req.files.map(file => ({
        buffer: file.buffer,
        contentType: file.mimetype
      }));
    }

    // Recalculate total stock if size_variants is being updated
    if (updateData.size_variants) {
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
