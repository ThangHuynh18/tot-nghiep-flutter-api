import express from 'express'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteCategoryForce,
} from '../controllers/categoryControllers.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getCategories)
router.post('/', protect, admin, createCategory)
router.put('/:id', protect, admin, updateCategory)
router.delete('/:id', protect, admin, deleteCategory)
router.delete('/:id/force', protect, admin, deleteCategoryForce)

export default router
