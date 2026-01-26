import express from 'express';
import { toggleWishlist, getWishlist, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/wishlist', getWishlist);
router.post('/wishlist/:productId', toggleWishlist);


router.put('/profile', updateProfile);

export default router;
