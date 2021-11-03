import express from 'express'
import {
    getMyCart,
    addItemToCart,
    removeItemFromCart,
    removeAllItemFromCart,
    updateQty,
} from '../controllers/cartController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, getMyCart)
router.put('/add-to-cart/:id', protect, addItemToCart)
router.put('/remove-all-item-cart/', protect, removeAllItemFromCart)
router.put('/remove-item-cart/:id', protect, removeItemFromCart)
router.put('/qty-update/:id', protect, updateQty)

export default router
