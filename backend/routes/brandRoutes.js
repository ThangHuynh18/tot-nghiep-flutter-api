import express from 'express'
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  deleteBrandForce,
} from '../controllers/brandControllers.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getBrands)
router.post('/', protect, admin, createBrand)
router.put('/:id', protect, admin, updateBrand)
router.delete('/:id', protect, admin, deleteBrand)
router.delete('/:id/force', protect, admin, deleteBrandForce)

export default router
