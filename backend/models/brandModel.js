import mongoose from 'mongoose'
import mongooseDelete from 'mongoose-delete'

const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên thương hiệu!'],
    },
    description: {
      type: String,
      default: '',
    },
    
  },
  {
    timestamps: true,
  }
)

// brandSchema.pre(
//   'updateOne',
//   { document: true, query: false },
//   function () {}
// )

brandSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
})

const Brand = mongoose.model('Brand', brandSchema)

export default Brand
