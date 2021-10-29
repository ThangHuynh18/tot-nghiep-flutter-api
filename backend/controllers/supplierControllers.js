import asyncHandler from 'express-async-handler'
import Supplier from '../models/supplierModel.js'
import Product from '../models/productModel.js'
import { customErrorHandler } from '../middleware/errorMiddleware.js'

// Fetch all suppliers
// [GET] /api/suppliers
// private/admin
const getSuppliers = asyncHandler(async (req, res) => {
  try {
    const suppliers = await Supplier.find({})

    res.json({ successCode: 'success', data: suppliers, errorCode: null })
  } catch (error) {
    res.status(400)
    throw new Error(`${error}`)
  }
})

// Get supplier by id
// [GET] /api/suppliers/:id
// private/admin
const getSupplierById = asyncHandler(async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)
    if (supplier) {
      res.json({ successCode: 'success', data: supplier, errorCode: null })
    } else {
      res.status(404)
      throw new Error('Không tìm thấy nhà cung cấp!')
    }
  } catch (error) {
    res.status(400)
    throw new Error(`${error}`)
  }
})

// Create suppliers
// [POST] /api/suppliers
// private/admin
const createSupplier = asyncHandler(async (req, res) => {
  const { name, phone, supplierAddress } = req.body

  try {
    const supplier = await Supplier.create({ name, phone, supplierAddress })
    if (!supplier) {
      res.status(201).json({ status: 'success', data: supplier, errors: null })
    } else {
      res.status(404)
      throw new Error('Không tìm thấy NCC!')
    }
  } catch (error) {
    const errors = customErrorHandler(error, res)
    res
      .status(errors.statusCode)
      .json({ status: 'fail', data: null, errors: errors.message })
  }
})

// Update brands
// [PUT] /api/suppliers/:id
// private/admin
const updateSupplier = asyncHandler(async (req, res) => {
  const { name, phone, supplierAddress } = req.body
  try {
    const supplier = await Supplier.findById(req.params.id)

    if (supplier) {
      supplier.name = name || supplier.name
      supplier.phone = phone || supplier.phone
      supplier.supplierAddress = supplierAddress || supplier.supplierAddress
      const updateSupplier = await supplier.save()

      res
        .status(200)
        .json({ successCode: 'success', data: updateSupplier, errorCode: null })
    } else {
      res.status(404)
      throw new Error('Không tìm thấy nhà cung cấp')
    }
  } catch (error) {
    res.status(404)
    throw new Error(`${error}`)
  }
})

// Delete supplier
// [DELETE] /api/suppliers/:id
// private/admin
const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id)

  if (supplier) {
    const alreadyHaveProducts = await Product.findOne({
      supplier: supplier._id,
    })
    if (alreadyHaveProducts) {
      res.status(400)
      throw new Error('Có sản phẩm nhập từ nhà cung cấp này')
    } else {
      await supplier.delete()
      res.status(200).json({ successCode: 'success', errorCode: null })
    }
  } else {
    res.status(404)
    throw new Error('Không tìm thấy nhà cung cấp này')
  }
})

// @desc    Force Delete brands
// @router  DELETE /api/brands/:id/force
// @access  private/admin
const deleteBrandForce = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findOneWithDeleted({ _id: req.params.id })

  if (supplier) {
    await supplier.deleteOne()

    res.status(200).json({ successCode: 'success', errorCode: null })
  } else {
    res.status(404)
    throw new Error('Không tìm thấy nhà cung cấp này!')
  }
})

export {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  deleteBrandForce,
}
