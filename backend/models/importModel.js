import mongoose from 'mongoose'
import { OrderStatus } from '../libs/constants/orderStatusConstants.js'

const importSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderSupplier: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'OrderSupplier',
    },
    importItems: [
      {
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
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

const Import = mongoose.model('Import', importSchema)

export default Import
