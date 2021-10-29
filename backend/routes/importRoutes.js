import express from 'express'
import {
  addImportItems,
  getImportOrderById,
  getImportOrder,
  updateImportOrderStatus,
} from '../controllers/importControllers.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, admin, getImportOrder)
router.post('/', protect, admin, addImportItems)
router.get('/:id', protect, admin, getImportOrderById)
router.put('/:id/status', protect, admin, updateImportOrderStatus)

export default router
