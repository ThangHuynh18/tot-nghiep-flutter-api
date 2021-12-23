import express from 'express'
import {
    productBestSeller,
    orderBetween,
    saleMonth,
    profitMonth,
} from '../controllers/dashboardController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.put('/order', protect, admin, orderBetween)
router.put('/product', protect, admin, productBestSeller)
router.put('/sale', protect, admin, saleMonth)
router.put('/profit', protect, admin, profitMonth)


export default router
