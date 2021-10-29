import mongoose from 'mongoose'
import mongooseDelete from 'mongoose-delete'

const roleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên quyền!'],
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

roleSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
})

const Role = mongoose.model('Role', roleSchema)

export default Role
