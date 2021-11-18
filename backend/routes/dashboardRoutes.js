import express from 'express'
import {
    productBestSeller,
    orderBetween,
} from '../controllers/dashboardController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.put('/order', protect, admin, orderBetween)
router.put('/product', protect, admin, productBestSeller)


export default router
