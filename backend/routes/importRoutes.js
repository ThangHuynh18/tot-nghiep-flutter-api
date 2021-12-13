import express from 'express'
import {
  addImportItems,
  getImportOrderById,
  getImportOrder,
  updateImportOrderStatus,
  getAllImportByStatus,
} from '../controllers/importControllers.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, getImportOrder)
router.post('/', protect, addImportItems)
router.get('/:id', protect, getImportOrderById)
router.put('/:id/status', protect, updateImportOrderStatus)
router.get('/status/:status', protect, getAllImportByStatus)
// router.get('/', protect, admin, getImportOrder)
// router.post('/', protect, admin, addImportItems)
// router.get('/:id', protect, admin, getImportOrderById)
// router.put('/:id/status', protect, admin, updateImportOrderStatus)
// router.get('/status/:status', protect, admin, getAllImportByStatus)

export default router
