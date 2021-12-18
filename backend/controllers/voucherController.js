import asyncHandler from 'express-async-handler'
import Voucher from '../models/voucherModel.js'


// @desc        Get all voucher
// @route       GET /api/users
// @access      Private/Admin
const getVouchers = asyncHandler(async (req, res) => {
    const vouchers = await Voucher.find({}).sort('-createdAt')
    res.json(vouchers)
})

// @desc        Create a new voucher
// @route       POST /api/vouchers
// @access      Private/ Admin
const createVoucher = asyncHandler(async (req, res) => {
    const { name, discount } = req.body

    const voucherExists = await Voucher.findOne({ name })

    if (voucherExists) {
        res.status(400)
        throw new Error('Voucher already exists')
    }

    const voucher = await Voucher.create({
        name,
        discount
    })

    if (voucher) {
        res.status(201).json({
            _id: voucher._id,
            name: voucher.name,
            discount: voucher.discount,
        })
    } else {
        res.status(400)
        throw new Error('Invalid voucher data')
    }
})

// @desc        Update voucher
// @route       PUT /api/vouchers/:id
// @access      Private/Admin
const updateVoucher = asyncHandler(async (req, res) => {
    const voucher = await Voucher.findById(req.params.id)
    const { name, discount } = req.body

    if (voucher) {
        voucher.name = name || voucher.name
        voucher.discount = discount || voucher.discount

        const updatedVoucher = await voucher.save()
        res.json({
            _id: updatedVoucher._id,
            name: updatedVoucher.name,
            discount: updatedVoucher.discount,
        })
    }
    else {
        res.status(404)
        throw new Error('User not found ')
    }
})

// @desc        delete voucher 
// @route       PUT /api/vouchers/:id
// @access      Private/Admin
const deleteVoucher = asyncHandler(async (req, res) => {
    const voucher = await Voucher.findById(req.params.id)
    if (voucher) {
        await voucher.remove()
        res.json({ message: 'Voucher removed' })
    }
    else {
        res.status(404)
        throw new Error('Voucher not found ')
    }
})


// Get voucher discount < 10%
// [GET] /api/vouchers/discount
// public
const getDiscountVoucher = asyncHandler(async (req, res) => {
  try {
    const discount = await Voucher.find({ discount: { $lt: 10 } })
      .sort({ discount: 'desc' })
    if (discount) {
      res.status(200).json(discount)
    } else {
      res.status(404)
      throw new Error('Không tìm được!')
    }
  } catch (error) {
    res.status(400)
    throw new Error(`${error}`)
  }
})

export { getVouchers, createVoucher, updateVoucher, deleteVoucher, getDiscountVoucher }
