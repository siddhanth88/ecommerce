import express from 'express';
import {
  getCategories,
  getCategoryTree,
  getCategoryChildren,
  getCategory,
  getMainCategories
} from '../controllers/categoryController.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/tree', getCategoryTree);
router.get('/main', getMainCategories);
router.get('/:idOrSlug', getCategory);
router.get('/:id/children', getCategoryChildren);

export default router;
