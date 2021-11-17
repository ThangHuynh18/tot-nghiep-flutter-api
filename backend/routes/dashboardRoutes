import express from 'express'
import {
    productBestSeller,
    orderBetween,
} from '../controllers/dashboardController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/order', protect, admin, orderBetween)
router.get('/product', protect, admin, productBestSeller)


export default router
