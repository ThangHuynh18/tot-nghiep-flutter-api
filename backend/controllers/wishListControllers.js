import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import User from '../models/userModel.js'
import { customErrorHandler } from '../middleware/errorMiddleware.js'

// Get my wishlist
// [GET] /api/wishlist
const getMyWishList = asyncHandler(async (req, res) => {
  try {
    const wishlist = await User.findById({ _id: req.user._id })
      .populate({
        path: 'wishListItems',
        populate: {
          path: 'product',
          select: 'name images price countInStock',
        },
      })
      .select('wishListItems -_id')
      .sort({ createdAt: 'desc' })
    if (wishlist) {
      res.json({
        status: 'success',
        data: wishlist.wishListItems,
        errors: null,
      })
    } else {
      res.status(404)
      throw new Error(
        'Không tìm thấy danh sách sản phẩm yêu thích của người dùng này!'
      )
    }
  } catch (error) {
    const errors = customErrorHandler(error, res)
    res.status(errors.statusCode).json({
      status: 'fail',
      data: null,
      errors: errors.message,
    })
  }
})

// @desc    Add items to WishList
// @router  PUT /api/wishlist/add-to-WishList/:id-product
// @access  private
const addItemToWishList = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (product) {
      const item = {
        name: product.name,
        product: product._id,
      }

      const alreadyAdded = req.user.wishListItems.find(
        (item) => item.product._id.toString() === product._id.toString()
      )
      if (!alreadyAdded) {
        req.user.wishListItems.push(item)
      }

      await req.user.save()
      res.status(200).json({
        status: 'success',
        data: {
          product: {
            _id: product._id,
            name: product.name,
            price: product.price,
            images: product.images,
            countInStock: product.countInStock,
            
          },
        },
      })
    } else {
      res.status(404)
      throw new Error('Không tìm thấy sản phẩm!')
    }
  } catch (error) {
    const errors = customErrorHandler(error, res)
    res.status(errors.statusCode).json({
      status: 'fail',
      data: null,
      errors: errors.message,
    })
  }
})

// @desc    Remove items from WishList
// @router  PUT /api/wishlist/remove-item-WishList/:id-product
// @access  private
const removeItemFromWishList = asyncHandler(async (req, res) => {
  const productId = req.params.id

  if (req.user.wishListItems.length <= 0) {
    res.status(400)
    throw new Error('No items on WishList')
  }

  const alreadyOnWishList = req.user.wishListItems.find(
    (item) => item.product.toString() === productId
  )

  if (alreadyOnWishList) {
    req.user.wishListItems = req.user.wishListItems.filter(
      (item) => item.product.toString() !== alreadyOnWishList.product.toString()
    )

    //req.user.wishListItems = remove.slice()

    await req.user.save()
    res.status(200).json({ message: 'Item Removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Remove all items from WishList
// @router  PUT /api/wishlist/remove-all-item-WishList
// @access  private
const removeAllItemFromWishList = asyncHandler(async (req, res) => {
  if (req.user.wishListItems.length <= 0) {
    res.status(400)
    throw new Error('No items on WishList')
  }

  req.user.wishListItems = []

  await req.user.save()
  res.status(200).json({ message: 'All Items Removed' })
})

export {
  getMyWishList,
  addItemToWishList,
  removeItemFromWishList,
  removeAllItemFromWishList,
}
