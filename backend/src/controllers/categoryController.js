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
