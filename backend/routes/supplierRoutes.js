import express from 'express'
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '../controllers/supplierControllers.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, admin, getSuppliers)
router.get('/:id', protect, admin, getSupplierById)
router.post('/', protect, admin, createSupplier)
// router.post('/', protect, admin, createBrand)
router.put('/:id', protect, admin, updateSupplier)
router.delete('/:id', protect, admin, deleteSupplier)
// router.delete('/:id/force', protect, admin, deleteBrandForce)

export default router
