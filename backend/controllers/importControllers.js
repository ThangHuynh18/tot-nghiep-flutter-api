import asyncHandler from 'express-async-handler'
import OrderSupplier from '../models/orderSupplierModel.js'
import Import from '../models/importModel.js'
import Product from '../models/productModel.js'
import User from '../models/userModel.js'
import { customErrorHandler } from '../middleware/errorMiddleware.js'
import { OrderStatus } from '../libs/constants/orderStatusConstants.js'

// Create new import
// [POST] /api/imports
// private/admin
const addImportItems = asyncHandler(async (req, res) => {
  const { importItems, orderSupplier, totalPrice } = req.body
  try {
    if (importItems && importItems.length === 0) {
      res.status(400)
      throw new Error('Không có sản phẩm để lập phiếu nhập!')
    } else {
      const findOrderSupplier = await OrderSupplier.findById(orderSupplier)
      if (findOrderSupplier) {
        if (
          findOrderSupplier.status !== 'FINISH' &&
          findOrderSupplier.status !== 'CANCEL' &&
          findOrderSupplier.status === 'ACCEPT'
        ) {
          importItems.forEach((importItem) => {
            const checkExistItem = findOrderSupplier.orderItems.some((item) => {
              return item.product.toString() === importItem.product.toString()
            })
            if (!checkExistItem) {
              res.status(404)
              throw new Error('Sản phẩm này không có trong phiếu đặt!')
            }
          })

          const importOrder = new Import({
            importItems,
            user: req.user._id,
            orderSupplier,
            totalPrice,
          })

          const createImport = await importOrder.save()

          findOrderSupplier.status = OrderStatus.FINISH
          await findOrderSupplier.save()
          res.status(201).json({
            successCode: 'success',
            data: createImport,
            errorCode: null,
          })
        } else {
          res.status(404)
          throw new Error('Phếu đặt này đã có phiếu nhập hoặc bị hủy!')
        }
      } else {
        res.status(404)
        throw new Error('Không tìm thấy phiếu đặt này!')
      }
    }
  } catch (error) {
    //const errors = customErrorHandler(error, res)
    res.status(400)
    throw new Error(`${error}`)
  }
})

// Get import order by id
// [GET] /api/imports/:id
// private/admin
const getImportOrderById = asyncHandler(async (req, res) => {
  const importOrder = await Import.findById(req.params.id).populate([
    {
      path: 'importItems',
      populate: {
        path: 'product',
        select: 'name images',
      },
    },
    { path: 'user', select: 'name email' },
    {
      path: 'orderSupplier',
      populate: [
        { path: 'supplier', select: 'name phone supplierAddress' },
        { path: 'user', select: 'name email' },
      ],
      select: 'supplier user createdAt',
    },
  ])

  if (importOrder) {
    res.json({ successCode: 'success', data: importOrder })
  } else {
    res.status(404)
    throw new Error('Không tìm thấy phiếu nhập này!')
  }
})

// Get all import order
// [GET] /api/imports
// private/admin
const getImportOrder = asyncHandler(async (req, res) => {
  try {
    const importOrder = await Import.find({}).populate([
      {
        path: 'importItems',
        populate: {
          path: 'product',
          select: 'name images',
        },
      },
      { path: 'user', select: 'name email' },
      {
        path: 'orderSupplier',
        populate: [
          { path: 'supplier', select: 'name phone supplierAddress' },
          { path: 'user', select: 'name email' },
        ],
        select: 'supplier user',
      },
    ])

    res
      .status(200)
      .json({ successCode: 'success', data: importOrder, errorCode: null })
  } catch (error) {
    res.status(400)
    throw new Error(`${error}`)
  }
})

// Update import status
// PUT /api/imports/:id/status
// private/admin
const updateImportOrderStatus = asyncHandler(async (req, res) => {
  try {
    const order = await Import.findById(req.params.id)
    const stt = req.query.stt
    if (order) {
      switch (stt) {
        case OrderStatus.CANCEL:
          if (order.status === OrderStatus.WAIT) {
            order.status = OrderStatus.CANCEL
            const findOrderSupplier = await OrderSupplier.findById(
              order.orderSupplier
            )
            if (findOrderSupplier) {
              if (findOrderSupplier.status === 'FINISH') {
                findOrderSupplier.status = OrderStatus.CANCEL
                await findOrderSupplier.save()
              } else {
                res.status(404)
                throw new Error('Phếu đặt này đã có phiếu nhập hoặc bị hủy!')
              }
            }
          } else {
            res.status(400)
            throw new Error('Phiếu đặt đã được hủy!')
          }
          break
        case OrderStatus.FINISH:
          if (order.status === OrderStatus.WAIT) {
            order.status = OrderStatus.FINISH
            order.importItems.forEach(async (i) => {
              const product = await Product.findById(i.product)
              if (product) {
                product.countInStock = product.countInStock + i.qty
              } else {
                res.status(400)
                throw new Error('Không tìm thấy sản phẩm trong kho!')
              }
              await product.save()
            })
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


// Get all order import by status
// [GET] /api/imports/status/:status
// private/admin
const getAllImportByStatus = asyncHandler(async (req, res) => {
  try {
    console.log(req.params.status)
    const orders = await Import.find({ status: req.params.status }).populate([
      {
        path: 'importItems',
        populate: {
          path: 'product',
          select: 'name images',
        },
      },
      { path: 'user', select: 'name email' },
      {
        path: 'orderSupplier',
        populate: [
          { path: 'supplier', select: 'name phone supplierAddress' },
          
        ],
        select: 'supplier user',
      },
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
  addImportItems,
  getImportOrderById,
  getImportOrder,
  updateImportOrderStatus,
  getAllImportByStatus,
}
