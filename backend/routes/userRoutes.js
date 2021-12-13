import express from 'express'
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  changePassword,
  totalUser,
  dashboard,
  getUserVoucher,
  addVoucherToUserVoucher,
  removeVoucherInUserVoucher,
} from '../controllers/userControllers.js'
import { protect, admin } from '../middleware/authMiddleware.js'
import cors from 'cors'
const router = express.Router()

router.post('/', registerUser)
router.get('/', protect, admin, getUsers)
router.post('/login', authUser)
router.get('/profile', protect, getUserProfile)
router.put('/profile', protect, updateUserProfile)
router.put('/change-password', protect, changePassword)
router.get('/total', protect, admin, totalUser)
router.get('/dashboard', protect, dashboard)
// router.get('/dashboard', protect, admin, dashboard)
router.get('/:id', protect, admin, getUserById)
router.put('/:id', protect, admin, updateUser)
router.delete('/:id', protect, admin, deleteUser)


router.get('/voucher/myvoucher',protect, getUserVoucher)
router.post('/voucher/add',protect, addVoucherToUserVoucher)
router.delete('/voucher/:id/remove',protect, removeVoucherInUserVoucher)

export default router
