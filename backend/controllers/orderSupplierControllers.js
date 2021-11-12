import asyncHandler from 'express-async-handler'
import OrderSupplier from '../models/orderSupplierModel.js'
import Product from '../models/productModel.js'
import User from '../models/userModel.js'
import { customErrorHandler } from '../middleware/errorMiddleware.js'
import { OrderStatus } from '../libs/constants/orderStatusConstants.js'

// Create new order supplier
// [POST] /api/orders-suppliers
// private/admin
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, supplier, totalPrice } = req.body
  try {
    if (orderItems && orderItems.length === 0) {
      res.status(400)
      throw new Error('Không có sản phẩm để đặt hàng!')
    } else {
      const order = new OrderSupplier({
        orderItems,
        user: req.user._id,
        supplier,
        totalPrice,
      })

      const createOrder = await order.save()
      // createOrder.orderItems.forEach(async (i) => {
      //   const product = await Product.findById(i.product)
      //   if (product) {
      //     product.countInStock = product.countInStock + i.qty
      //   }
      //   await product.save()
      // })
      res
        .status(201)
        .json({ status: 'success', data: createOrder, errors: null })
    }
  } catch (error) {
    //const errors = customErrorHandler(error, res)
    res.status(400)
    throw new Error(`${error}`)
  }
})

// Get order supplier by id
// [GET] /api/order-suppliers/:id
// private
const getOrderSupplierById = asyncHandler(async (req, res) => {
  try {
    const orderSupplier = await OrderSupplier.findById(req.params.id).populate([
      {
        path: 'orderItems',
        populate: {
          path: 'product',
          select: 'name images',
        },
      },
      { path: 'user', select: 'name email' },
      { path: 'supplier', select: 'name phone supplierAddress' },
    ])

    if (orderSupplier) {
      res
        .status(200)
        .json({ successCode: 'success', data: orderSupplier, errorCode: null })
    } else {
      res.status(404)
      throw new Error('Không tìm thấy phiếu đặt này')
    }
  } catch (error) {
    res.status(400)
    throw new Error(`${error}`)
  }
})

// Update order supplier status
// PUT /api/order-suppliers/:id/status
// private/admin
const updateOrderSupplierStatus = asyncHandler(async (req, res) => {
  try {
    const order = await OrderSupplier.findById(req.params.id)
    const stt = req.query.stt
    if (order) {
      switch (stt) {
        case OrderStatus.ACCEPT:
          if (order.status === OrderStatus.WAIT) {
            order.status = OrderStatus.ACCEPT
          } else {
            res.status(400)
            throw new Error('Phiếu đặt này đã hoàn thành hoặc bị hủy!')
          }
          break
        case OrderStatus.CANCEL:
          if (
            order.status === OrderStatus.WAIT ||
            order.status === OrderStatus.ACCEPT
          ) {
            order.status = OrderStatus.CANCEL
          } else {
            res.status(400)
            throw new Error('Phiếu đặt đã được hủy!')
          }
          break
        case OrderStatus.FINISH:
          if (order.status === OrderStatus.ACCEPT) {
            order.status = OrderStatus.FINISH
          } else {
            res.status(400)
            throw new Error('Phiếu đặt này đã hoàn thành hoặc bị hủy!')
          }
          break
        default:
          break
      }
      const updateOrder = await order.save()
      res.status(200).json(updateOrder)
    } else {
      res.status(404)
      throw new Error('Không tìm thấy phiếu đặt!')
    }
  } catch (error) {
    res.status(400)
    throw new Error(`${error}`)
  }
})

// Get all orders supplier
// [GET] /api/order-suppliers
// private/admin
const getOrderSuppliers = asyncHandler(async (req, res) => {
  const query = {}
  req.query.status ? (query.status = req.query.status) : query
  try {
    const orderSuppliers = await OrderSupplier.find({ ...query }).populate([
      {
        path: 'orderItems',
        populate: {
          path: 'product',
          select: 'name images',
        },
      },
      { path: 'user', select: 'name email' },
      { path: 'supplier', select: 'name phone' },
    ])

    res
      .status(200)
      .json({ successCode: 'success', data: orderSuppliers, errorCode: null })
  } catch (error) {
    res.status(400)
    throw new Error(`${error}`)
  }
})


// Get all order supplier by status
// [GET] /api/order-suppliers/status/:status
// private/admin
const getAllOrderSupplierByStatus = asyncHandler(async (req, res) => {
  try {
    console.log(req.params.status)
    const orders = await OrderSupplier.find({ status: req.params.status }).populate([
      {
        path: 'orderItems',
        populate: {
          path: 'product',
          select: 'name images',
        },
      },
      { path: 'user', select: 'name email' },
      { path: 'supplier', select: 'name phone' },
    ]).sort({
      updatedAt: 'desc',
    })

    
    if (orders) {
      res.json(orders)
    } else {
      res.status(404)
      throw new Error('Không tìm thấy đơn đặt hàng!')
    }
  } catch (error) {
    const errors = customErrorHandler(error, res)
    res
      .status(errors.statusCode)
      .json({ status: 'fail', data: null, errors: errors.message })
  }
})



export {
  addOrderItems,
  getOrderSupplierById,
  updateOrderSupplierStatus,
  getOrderSuppliers,
  getAllOrderSupplierByStatus,
}
