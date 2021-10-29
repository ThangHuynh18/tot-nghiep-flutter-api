import mongoose from 'mongoose'
import mongooseDelete from 'mongoose-delete'

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên danh mục!'],
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

// categorySchema.pre(
//   'updateOne',
//   { document: true, query: false },
//   function () {}
// )

categorySchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
})

const Category = mongoose.model('Category', categorySchema)

export default Category
