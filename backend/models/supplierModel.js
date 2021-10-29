import mongoose from 'mongoose'
import mongooseDelete from 'mongoose-delete'

const supplierSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên NCC!'],
      unique: true,
    },
    phone: {
      required: [true, 'Vui lòng nhập SĐT!'],
      type: String,
    },
    supplierAddress: {
      address: { type: String, required: true, default: '' },
      city: { type: String, required: true, default: '' },
      district: { type: String, required: true, default: '' },
      ward: { type: String, required: true, default: '' },
    },
  },
  {
    timestamps: true,
  }
)

supplierSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
})

const Supplier = mongoose.model('Supplier', supplierSchema)

export default Supplier
