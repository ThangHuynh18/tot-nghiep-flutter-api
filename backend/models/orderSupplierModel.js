import mongoose from 'mongoose'
import { OrderStatus } from '../libs/constants/orderStatusConstants.js'

const orderSupplierSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Chưa chọn nhà cung cấp!'],
      ref: 'Supplier',
    },
    orderItems: [
      {
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, 'Chưa có sản phẩm!'],
          ref: 'Product',
        },
      },
    ],
    status: {
      type: String,
      required: true,
      enum: OrderStatus,
      default: OrderStatus.WAIT,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
  },
  {
    timestamps: true,
  }
)

const OrderSupplier = mongoose.model('OrderSupplier', orderSupplierSchema)

export default OrderSupplier
