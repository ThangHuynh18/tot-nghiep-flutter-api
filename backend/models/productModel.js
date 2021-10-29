import mongoose from 'mongoose'
import slug from 'mongoose-slug-generator'
import mongooseDelete from 'mongoose-delete'

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên sản phẩm!'],
    },
    images: [
      {
        imageLink: { type: String, required: [true, 'Chưa chọn hình ảnh!'] },
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Chưa chọn thương hiệu!'],
      ref: 'Brand',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Chưa chọn danh mục!'],
      ref: 'Category',
    },
    description: {
      type: String,
      required: [true, 'Vui lòng nhập mô tả sản phẩm!'],
    },
    discount: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0.0,
    },
    numberReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0.0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },

  },
  {
    timestamps: true,
  }
)

// Add plugins
//mongoose.plugin(slug)
productSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
})

const Product = mongoose.model('Product', productSchema)

export default Product
