import express from 'express'
import {
  addOrderItems,
  getOrderSupplierById,
  getOrderSuppliers,
  updateOrderSupplierStatus,
  getAllOrderSupplierByStatus,
} from '../controllers/orderSupplierControllers.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, admin, getOrderSuppliers)
router.post('/', protect, admin, addOrderItems)
router.get('/:id', protect, admin, getOrderSupplierById)
router.put('/:id/status', protect, admin, updateOrderSupplierStatus)
router.get('/status/:status', protect, admin, getAllOrderSupplierByStatus)

export default router
