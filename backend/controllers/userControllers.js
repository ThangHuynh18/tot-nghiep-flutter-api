import asyncHandler from 'express-async-handler'
import Role from '../models/roleModel.js'
import User from '../models/userModel.js'
import Product from '../models/productModel.js'
import Order from '../models/orderModel.js'
import generateToken from '../utils/generateToken.js'

// Auth user & get token
// [POST] /api/users/login
// public
const authUser = asyncHandler(async (req, res) => {

  console.log(req.body)

  const { email, password } = req.body

  const user = await User.findOne({ email: email }).populate({
    path: 'wishListItems',
    populate: { path: 'product', select: 'name image price countInStock' },
  })
  

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      wishListItems: user.wishListItems,
      shippingAddress: user.shippingAddress,
      token: token,
      phone: user.phone,
      avatar: user.avatar,
    })
  } else {
    res.status(401)
    throw new Error('Email hoặc mật khẩu không đúng')
  }
})

// Get user profile
// [GET] /api/users/profile
// private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'cartItems',
    populate: { path: 'product', select: 'name image' },
  })

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      shippingAddress: user.shippingAddress,
      wishListItems: user.wishListItems,
      //cartItems: user.cartItems,
      role: user.role,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// Register new user
// [GET] /api/users
// Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, avatar, shippingAddress } = req.body

  const userExist = await User.findOne({ email })
  console.log(req.body.role)
  let role1 = req.body.role
  if(!role1){
    const roleExist = await Role.findOne({ name: 'customer' })
   // const user = await User.findOne({ role: roleExist._id })
   role1 = roleExist._id
  }

  if (userExist) {
    res.status(400)
    throw new Error('Email này đã được đăng ký!')
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role1,
    phone,
    avatar,
    shippingAddress,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      shippingAddress: user.shippingAddress,
      role: user.role,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('User not found')
  }
})

// Update user profile
// [PUT] /api/users/profile
// private
const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, avatar, shippingAddress } = req.body
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = name || user.name
    user.email = email || user.email
    user.phone = phone || user.phone
    user.avatar = avatar || user.avatar
    user.shippingAddress = shippingAddress || user.shippingAddress

    const updateUser = await user.save()

    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      phone: updateUser.phone,
      avatar: updateUser.avatar,
      shippingAddress: updateUser.shippingAddress,
      role: user.role,
      token: generateToken(updateUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// Get all user
// [GET] /api/users
// private/admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ createdAt: 'desc' })

  res.json(users)
})

// Delete user
// [DELETE] /api/users
// private/admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'User deleted' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// Get user by id
// [GET] /api/users/:id
// private/admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// Update user
// [PUT] /api/users/:id
// private/admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.role = req.body.role || user.role
    user.phone = req.body.phone || user.phone
    user.shippingAddress = req.body.shippingAddress || user.shippingAddress

    const updateUser = await user.save()

    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      role: updateUser.role,
      phone: updateUser.phone,
      shippingAddress: updateUser.shippingAddress,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// Change password
// [PUT] /api/users/change-password
// Private
const changePassword = asyncHandler(async (req, res) => {
  const { password, newPassword } = req.body
  try {
    const user = await User.findById(req.user._id)

    if (user) {
      if (await user.matchPassword(password)) {
        user.password = newPassword
        await user.save()

        res.status(200).json({
          successCode: 'success',
          message: 'Đổi mật khẩu thành công!',
          errorCode: null,
        })
      }
      res.status(400)
      throw new Error('Mật khẩu cũ không đúng!')
    } else {
      res.status(404)
      throw new Error('Không tìm thấy người dùng này!')
    }
  } catch (error) {
    res.status(400)
    throw new Error(`${error}`)
  }
})

// Total user
// [GET] /api/users/total
// Private/admin
const totalUser = asyncHandler(async (req, res) => {
  try {
    const count = await User.countDocuments({ role: '61544803b918f284d3a05618' })
    res
      .status(200)
      .json({ successCode: 'success', data: count, errorCode: null })
  } catch (error) {
    res.status(400)
    throw new Error(`${error}`)
  }
})


// Total
// [GET] /api/users/dashboard
// Private/admin
const dashboard = asyncHandler(async (req, res) => {
  try {
    const totalCustomer = await User.countDocuments({ role: '61544803b918f284d3a05618' })
    const totalProduct = await Product.countDocuments()
    const totalOrder = await Order.countDocuments()

    const data = {
      totalCustomer: totalCustomer,
      totalOrder: totalOrder,
      totalProduct: totalProduct
    }
    res
      .status(200)
      .json({ successCode: 'success', data: data, errorCode: null })
  } catch (error) {
    res.status(400)
    throw new Error(`${error}`)
  }
})


export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  changePassword,
  totalUser,
  dashboard,
}
