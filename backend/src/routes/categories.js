import express from 'express';
import {
  getCategories,
  getCategoryTree,
  getCategoryChildren,
  getCategory,
  getMainCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/tree', getCategoryTree);
router.get('/main', getMainCategories);
router.get('/:idOrSlug', getCategory);
router.get('/:id/children', getCategoryChildren);

// Admin routes
router.post('/', protect, admin, createCategory);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

export default router;
