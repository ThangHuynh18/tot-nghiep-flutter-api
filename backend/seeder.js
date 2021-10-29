import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import users from './data/users.js'
import products from './data/products.js'
import categories from './data/categories.js'
import brands from './data/brands.js'
import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'
import Category from './models/categoryModel.js'
import Brand from './models/brandModel.js'
import connectDB from './config/db.js'

dotenv.config()

connectDB()

const importData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()
    await Category.deleteMany()
    await Brand.deleteMany()

    const createUsers = await User.insertMany(users)

    const createCategory = await Category.insertMany(categories)

    const createBrand = await Brand.insertMany(brands)

    const adminUser = createUsers[0]._id

    const sampleProduct = products.map((product) => {
      return {
        ...product,
        user: adminUser,
        category: createCategory[Math.floor(Math.random() * 4)]._id,
        brand: createBrand[Math.floor(Math.random() * 4)]._id,
      }
    })

    await Product.insertMany(sampleProduct)

    console.log('Data Imported!'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    console.log('Data Destroyed!'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
