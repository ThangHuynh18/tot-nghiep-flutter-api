import express from 'express'
const router = express.Router()
import {
    getVouchers, createVoucher, updateVoucher, deleteVoucher, getDiscountVoucher
} from '../controllers/voucherController.js'
import { protect, admin } from '../middleware/authMiddleware.js'
import cors from 'cors'



router.get('/', getVouchers)
router.get('/discount', getDiscountVoucher)
router.post('/', protect, admin, createVoucher)
router.put('/:id',protect, admin, updateVoucher)
router.delete('/:id', protect, admin, deleteVoucher)

export default router
