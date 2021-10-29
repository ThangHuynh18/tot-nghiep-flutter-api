import express from 'express'
import {
  getMyWishList,
  addItemToWishList,
  removeItemFromWishList,
  removeAllItemFromWishList,
} from '../controllers/wishListControllers.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, getMyWishList)
router.put('/add-to-wishlist/:id', protect, addItemToWishList)
router.put('/remove-all-item-wishlist/', protect, removeAllItemFromWishList)
router.put('/remove-item-wishlist/:id', protect, removeItemFromWishList)

export default router
