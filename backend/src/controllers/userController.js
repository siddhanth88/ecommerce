import User from '../models/User.js';
import Product from '../models/Product.js';

/**
 * @desc    Toggle product in wishlist
 * @route   POST /api/users/wishlist/:productId
 * @access  Private
 */
export const toggleWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const productId = req.params.productId;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Toggle wishlist
    const index = user.wishlist.findIndex(id => id.toString() === productId);
    if (index === -1) {
      user.wishlist.push(productId);
    } else {
      user.wishlist.splice(index, 1);
    }

    await user.save();

    res.status(200).json({
      success: true,
      wishlist: user.wishlist
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user wishlist
 * @route   GET /api/users/wishlist
 * @access  Private
 */
export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'wishlist',
      select: 'name brand price originalPrice discount imagesData category isActive sizes colors colorNames stock'
    });

    const products = user.wishlist.map(product => {
      const productObj = product.toObject();
      if (product.imagesData && product.imagesData.length > 0) {
        productObj.imageDataArray = product.imagesData.map(img => 
          `data:${img.contentType};base64,${img.buffer.toString('base64')}`
        );
      }
      return productObj;
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};
