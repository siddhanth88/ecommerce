import express from 'express';
import {
  getProducts,
  getProduct,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateSizeStock,
  updateSizePrice,
  getLowStockSizes
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);

// Admin routes
router.post('/', protect, admin, upload.any(), createProduct);
router.put('/:id', protect, admin, upload.any(), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

// Inventory routes
router.post('/:id/size/:size/update-stock', protect, admin, updateSizeStock);
router.post('/:id/size/:size/update-price', protect, admin, updateSizePrice);
router.get('/:id/low-stock-sizes', protect, admin, getLowStockSizes);

export default router;

