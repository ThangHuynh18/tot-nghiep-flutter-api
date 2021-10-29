import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      //token gồm 'Bearer + khoảng trắng + chuỗi jwt' nên sẽ split (ngăn cách) bởi ' ' và lấy phần tử 1 nghĩa là chuỗi jwt
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Không có quyền truy cập, token đã hết hạn!')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Không có quyền truy cập, không tìm thấy token!')
  }
})

const admin = (req, res, next) => {
  if (req.user && req.user.role == process.env.ADMIN) {
    next()
  } else {
    res.status(401)
    throw new Error('Chỉ admin mới có quyền truy cập vào mục này!')
  }
}

export { protect, admin }
