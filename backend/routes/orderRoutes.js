import express from 'express'
import {
  addOrderItems,
  getOrderById,
  updateOrderStatus,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getTotalOrdersByStatus,
  getOrdersByStatus,
} from '../controllers/orderControllers.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', protect, addOrderItems)
router.get('/', protect, admin, getOrders)
router.get('/total', protect, admin, getTotalOrdersByStatus)
router.get('/myorders', protect, getMyOrders)
router.get('/:id', protect, getOrderById)
router.put('/:id/pay', protect, updateOrderToPaid)
router.put('/:id/status', protect, updateOrderStatus)
router.put('/:id/deliver', protect, admin, updateOrderToDelivered)
router.get('/myorders/:status', protect, getOrdersByStatus)

export default router
