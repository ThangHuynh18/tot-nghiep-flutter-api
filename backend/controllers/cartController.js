import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import User from '../models/userModel.js'
import { customErrorHandler } from '../middleware/errorMiddleware.js'

// Get my cart
// [GET] /api/cart
const getMyCart = asyncHandler(async (req, res) => {
  try {
    const cart = await User.findById({ _id: req.user._id })
      .populate({
        path: 'cartItems',
        populate: {
          path: 'product',
          select: 'name images price countInStock',
        },
      })
      .select('cartItems -_id')
      .sort({ createdAt: 'desc' })
    if (cart) {
      res.json({
        status: 'success',
        data: cart.cartItems,
        errors: null,
      })
    } else {
      res.status(404)
      throw new Error(
        'Không tìm thấy sản phẩm trong giỏ hàng của người dùng này!'
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

// @desc    Add items to cart
// @router  PUT /api/cart/add-to-cart/:id-product
// @access  private
const addItemToCart = asyncHandler(async (req, res) => {
  try {
    const quantity = req.body.quantity
    const product = await Product.findById(req.params.id)

    if (product) {
      const item = {
        name: product.name,
        product: product._id,
        qty: quantity
      }

      const alreadyAdded = req.user.cartItems.find(
        (item) => item.product._id.toString() === product._id.toString()
      )
      if (!alreadyAdded) {
        req.user.cartItems.push(item)
      }
      else {
          req.user.cartItems = req.user.cartItems.map(
            (item) => {
                console.log("Item product: "+item.product)
                console.log("Already add: "+alreadyAdded.product)
                if(item.product.toString() === alreadyAdded.product.toString()){
                  if(!quantity || !req.body){
                    item.qty += 1
                  } else{
                    item.qty += quantity
                  }
                    
                }
                return item
                //console.log("Qty: "+item.qty)
            }
          )
          console.log("Cart item: "+req.user.cartItems)
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

// @desc    Remove items from cart
// @router  PUT /api/cart/remove-item-cart/:id-product
// @access  private
const removeItemFromCart = asyncHandler(async (req, res) => {
  const productId = req.params.id

  if (req.user.cartItems.length <= 0) {
    res.status(400)
    throw new Error('No items on cart')
  }

  const alreadyOnCart = req.user.cartItems.find(
    (item) => item.product.toString() === productId
  )

  if (alreadyOnCart) {
    req.user.cartItems = req.user.cartItems.filter(
      (item) => item.product.toString() !== alreadyOnCart.product.toString()
    )

    //req.user.wishListItems = remove.slice()

    await req.user.save()
    res.status(200).json({ message: 'Item Removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Remove all items from cart
// @router  PUT /api/cart/remove-all-item-cart
// @access  private
const removeAllItemFromCart = asyncHandler(async (req, res) => {
  if (req.user.cartItems.length <= 0) {
    res.status(400)
    throw new Error('No items on cart')
  }

  req.user.cartItems = []

  await req.user.save()
  res.status(200).json({ message: 'All Items Removed' })
})


// Update qty in cart
// [PUT] /api/cart/qty-update/:id-product
// private
const updateQty = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id
    const quantity  = req.body.quantity
      const alreadyOnCart = req.user.cartItems.find(
        (item) => item.product.toString() === productId
      )
    console.log("already on cart: "+alreadyOnCart)
    console.log("body quantity: "+quantity)
      if (alreadyOnCart) {
        
        req.user.cartItems = req.user.cartItems.map(
          (item) => {
            if(item.product.toString() === alreadyOnCart.product.toString()){
             
                  item.qty = quantity
              
            }
            console.log("item quantity: "+item.qty)
            return item
          }
        )
      }
        //req.user.wishListItems = remove.slice()
    
        await req.user.save()
        res.status(200).json({ message: 'Quantity Updated' })

  } catch (error) {
    res.status(400)
    throw new Error(`${error}`)
  }
})

export {
  getMyCart,
  addItemToCart,
  removeItemFromCart,
  removeAllItemFromCart,
  updateQty,
}
