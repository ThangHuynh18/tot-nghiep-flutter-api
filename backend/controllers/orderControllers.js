import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'
import User from '../models/userModel.js'
import { customErrorHandler } from '../middleware/errorMiddleware.js'
import { OrderStatus } from '../libs/constants/orderStatusConstants.js'

// Create new order
// [POST] /api/orders
// private
// before create order must to checked countInStock of product
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body
  try {
    if (orderItems && orderItems.length === 0) {
      res.status(400)
      throw new Error('Không có sản phẩm để đặt hàng!')
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
        status:
          paymentMethod === 'PayPal' ? OrderStatus.ACCEPT : OrderStatus.WAIT,
      })

      const createOrder = await order.save()
      //check qty of product
      createOrder.orderItems.forEach(async (i) => {
        const product = await Product.findById(i.product)
        if (product && product.countInStock > 0) {
          product.countInStock = product.countInStock - i.qty
        } else {
          res.status(400)
          throw new Error(`${product.name} đã hết hàng!`)
        }
        await product.save()
      })
      res
        .status(201)
        .json({ status: 'success', data: createOrder, errors: null })
    }
  } catch (error) {
    const errors = customErrorHandler(error, res)
    res
      .status(errors.statusCode)
      .json({ status: 'fail', data: null, errors: errors.message })
  }
})

// Get order by id
// [GET] /api/orders/:id
// private
const getOrderById = asyncHandler(async (req, res) => {
  //find order by id -> find orderItems belong to order has id -> find product to get name, image, price, category of that product
  //find order by id -> find user belong to order has id to get name, email of that user
  const order = await Order.findById(req.params.id).populate([
    {
      path: 'orderItems',
      populate: {
        path: 'product',
        select: 'name images price',
        populate: { path: 'category', select: 'name' },
      },
    },
    { path: 'user', select: 'name email' },
  ])

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// Update order status
// PUT /api/orders/:id/status
// private
const updateOrderStatus = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    const stt = req.query.stt
    if (order) {
      switch (stt) {
        case OrderStatus.ACCEPT:
          if (order.status === OrderStatus.WAIT) {
            order.status = OrderStatus.ACCEPT
          } else {
            res.status(400)
            throw new Error('Đơn hàng này đã được xác nhận hoặc đã hoàn thành!')
          }
          break
        // case OrderStatus.DELIVERY:
        //   if (order.status === OrderStatus.ACCEPT) {
        //     order.status = OrderStatus.DELIVERY
        //   } else {
        //     res.status(400)
        //     throw new Error('Đơn hàng này đang giao!')
        //   }
        //   break
        // case OrderStatus.DELIVERED:
        //   if (order.status === OrderStatus.DELIVERY) {
        //     order.status = OrderStatus.DELIVERED
        //   } else {
        //     res.status(400)
        //     throw new Error('Đơn hàng này chưa được giao!')
        //   }
        //   break
        // case OrderStatus.FAIL:
        //   if (order.status === OrderStatus.DELIVERY) {
        //     order.status = OrderStatus.FAIL
        //   } else {
        //     res.status(400)
        //     throw new Error('Đơn hàng này chưa được giao!')
        //   }
        //   break
        case OrderStatus.CANCEL:
          if (
            order.status === OrderStatus.WAIT ||
            order.status === OrderStatus.ACCEPT
          ) {
            order.status = OrderStatus.CANCEL
            order.orderItems.forEach(async (i) => {
              const product = await Product.findById(i.product)
              if (product) {
                product.countInStock = product.countInStock + i.qty
              }
              await product.save()
            })
          } else {
            res.status(400)
            throw new Error('Đơn hàng này đã được hủy!')
          }
          break
        case OrderStatus.FINISH:
          if (order.status === OrderStatus.ACCEPT) {
            // order.isPaid = true
            // order.paidAt = Date.now()
            // order.isDelivered = true
            // order.deliveredAt = Date.now()
            order.status = OrderStatus.FINISH
          } else {
            res.status(400)
            throw new Error('Đơn hàng này chưa được giao hoặc đã bị hủy!')
          }
          break
        default:
          break
      }
      const updateOrder = await order.save()
      res.status(200).json(updateOrder)
    } else {
      res.status(404)
      throw new Error('Order not found')
    }
  } catch (error) {
    res.status(400)
    throw new Error(`${error}`)
  }
})

// @desc    Update order to paid
// @router  PUT /api/orders/:id/pay
// @access  private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    }

    const updateOrder = await order.save()

    res.status(200).json(updateOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order to delivered
// @router  PUT /api/orders/:id/deliver
// @access  private/admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()
    order.status = OrderStatus.FINISH

    const updateOrder = await order.save()

    res.status(200).json(updateOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Get logged in user orders
// @router  GET /api/orders/myorders
// @access  private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: 'desc',
  })

  res.json(orders)
})

// Get all orders
// [GET] /api/orders
// private/admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'id name')
    .sort('-createdAt')

  res.json(orders)
})

// Get total orders by status
// [GET] /api/orders/total?
// private/admin
const getTotalOrdersByStatus = asyncHandler(async (req, res) => {
  const status = req.query.status || ''
  try {
    if (status) {
      const total = await Order.countDocuments({ status: status })
      res.json({ successCode: 'success', data: total, errorCode: null })
    } else {
      const total = await Order.countDocuments()
      res.json({ successCode: 'success', data: total, errorCode: null })
    }
  } catch (error) {
    res.status(400)
    throw new Error(`${error}`)
  }
})


// Get my orders by status
// [GET] /api/orders/myorders/:status
// private
const getOrdersByStatus = asyncHandler(async (req, res) => {
  try {
    console.log(req.params.status)
    console.log(req.user._id)
    const orders = await Order.find({ user: req.user._id, status: req.params.status }).sort({
      updatedAt : 'desc',
    })

    if (orders) {
      res.json(orders)
    } else {
      res.status(404)
      throw new Error('Không tìm thấy đơn hàng!')
    }
  } catch (error) {
    const errors = customErrorHandler(error, res)
    res
      .status(errors.statusCode)
      .json({ status: 'fail', data: null, errors: errors.message })
  }
})



// Get all orders by status
// [GET] /api/orders/status/:status
// private
const getAllOrdersByStatus = asyncHandler(async (req, res) => {
  try {
    console.log(req.params.status)
    const orders = await Order.find({ status: req.params.status }).populate('user', 'id name').sort({
      createdAt: 'desc',
    })

    if (orders) {
      res.json(orders)
    } else {
      res.status(404)
      throw new Error('Không tìm thấy đơn hàng!')
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
  getOrderById,
  updateOrderStatus,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getTotalOrdersByStatus,
  getOrdersByStatus,
  getAllOrdersByStatus,
}
