import Category from '../models/Category.js';

/**
 * @desc    Get all categories (flat list)
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = async (req, res, next) => {
  try {
    const { level, parentId } = req.query;
    
    const query = {};
    if (level) query.level = Number(level);
    if (parentId) query.parentId = parentId;

    const categories = await Category.find(query)
      .populate('children')
      .sort({ level: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get category tree (hierarchical structure)
 * @route   GET /api/categories/tree
 * @access  Public
 */
export const getCategoryTree = async (req, res, next) => {
  try {
    // Get all categories
    const allCategories = await Category.find({}).lean();
    
    // Build tree structure
    const categoryMap = new Map();
    const rootCategories = [];

    // First pass: create map
    allCategories.forEach(cat => {
      categoryMap.set(cat._id.toString(), { ...cat, children: [] });
    });

    // Second pass: build tree
    allCategories.forEach(cat => {
      const category = categoryMap.get(cat._id.toString());
      if (cat.parentId) {
        const parent = categoryMap.get(cat.parentId.toString());
        if (parent) {
          parent.children.push(category);
        }
      } else {
        rootCategories.push(category);
      }
    });

    // Sort children by name
    const sortChildren = (categories) => {
      categories.sort((a, b) => a.name.localeCompare(b.name));
      categories.forEach(cat => {
        if (cat.children.length > 0) {
          sortChildren(cat.children);
        }
      });
    };
    sortChildren(rootCategories);

    res.status(200).json({
      success: true,
      tree: rootCategories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get children of a category
 * @route   GET /api/categories/:id/children
 * @access  Public
 */
export const getCategoryChildren = async (req, res, next) => {
  try {
    const { id } = req.params;

    const children = await Category.find({ parentId: id })
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: children.length,
      children
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single category by ID or slug
 * @route   GET /api/categories/:idOrSlug
 * @access  Public
 */
export const getCategory = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    let category;
    
    // Try to find by ID first
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(idOrSlug).populate('children');
    }
    
    // If not found, try by slug
    if (!category) {
      category = await Category.findOne({ slug: idOrSlug }).populate('children');
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Get parent chain for breadcrumbs
    const breadcrumbs = [];
    let current = category;
    while (current) {
      breadcrumbs.unshift({ _id: current._id, name: current.name, slug: current.slug });
      if (current.parentId) {
        current = await Category.findById(current.parentId);
      } else {
        current = null;
      }
    }

    res.status(200).json({
      success: true,
      category,
      breadcrumbs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get main categories (level 1)
 * @route   GET /api/categories/main
 * @access  Public
 */
export const getMainCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ level: 1 })
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    next(error);
  }
};
/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name, parentId, image } = req.body;

    let level = 1;
    if (parentId) {
      const parent = await Category.findById(parentId);
      if (!parent) {
        return res.status(404).json({
          success: false,
          error: 'Parent category not found'
        });
      }
      level = parent.level + 1;
      if (level > 3) {
        return res.status(400).json({
          success: false,
          error: 'Maximum category depth (3 levels) reached'
        });
      }
    }

    const category = await Category.create({
      name,
      parentId: parentId || null,
      level,
      image
    });

    res.status(201).json({
      success: true,
      category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { name, parentId, image } = req.body;
    const { id } = req.params;

    let category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Update level if parentId changes
    if (parentId !== undefined && parentId !== category.parentId?.toString()) {
      if (parentId === null || parentId === '') {
        category.level = 1;
        category.parentId = null;
      } else {
        const parent = await Category.findById(parentId);
        if (!parent) {
          return res.status(404).json({
            success: false,
            error: 'Parent category not found'
          });
        }
        category.level = parent.level + 1;
        category.parentId = parentId;

        if (category.level > 3) {
          return res.status(400).json({
            success: false,
            error: 'Maximum category depth (3 levels) reached'
          });
        }
      }
    }

    if (name) category.name = name;
    if (image !== undefined) category.image = image;

    await category.save();

    res.status(200).json({
      success: true,
      category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Check if category has children
    const childrenCount = await Category.countDocuments({ parentId: id });
    if (childrenCount > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete category with subcategories. Delete children first.'
      });
    }

    // Note: We might want to check for products too, but for now let's just delete
    // To be safer, we'd check Product.countDocuments({ $or: [{categoryId: id}, {subCategoryId: id}] })
    
    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Category deleted'
    });
  } catch (error) {
    next(error);
  }
};
