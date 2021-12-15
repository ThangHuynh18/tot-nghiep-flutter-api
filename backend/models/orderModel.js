import mongoose from 'mongoose'
import { OrderStatus } from '../libs/constants/orderStatusConstants.js'

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        qty: { type: Number, required: true },
//         name: { type: String, required: true },
//         image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true, default: ' ' },
      city: { type: String, required: true, default: ' ' },
      district: { type: String, required: true, default: ' ' },
      ward: { type: String, required: true, default: ' ' },
    },
    refund: {
      reason: { type: String, required: true, default: ' ' },
      refundAt: {
        type: Date, required: true
      },
      images: [
        {
          imageLink: { type: String, required: [true, 'Chưa chọn hình ảnh!'] },
        },
      ],
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: OrderStatus,
      default: OrderStatus.WAIT,
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
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

const Order = mongoose.model('Order', orderSchema)

export default Order
