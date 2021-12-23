import express from 'express'
import {
    productBestSeller,
    orderBetween,
    saleMonth,
} from '../controllers/dashboardController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.put('/order', protect, admin, orderBetween)
router.put('/product', protect, admin, productBestSeller)
router.put('/sale', protect, admin, saleMonth)


export default router
