import asyncHandler from 'express-async-handler'
import Category from '../models/categoryModel.js'
import Product from '../models/productModel.js'

// @desc    Fetch all categories
// @router  GET /api/categories
// @access  public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: 'desc' })

  res.json(categories)
})

// @desc    Fetch all categories
// @router  POST /api/categories
// @access  private/admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body

  const categoryExist = await Category.findOne({ name })

  if (categoryExist) {
    res.status(400)
    throw new Error('Category already exists')
  }

  const category = await Category.create({ name, description })

  if (category) {
    res.status(201).json(category)
  } else {
    res.status(404)
    throw new Error('Category not found')
  }
})

// @desc    Update category
// @router  PUT /api/categories/:id
// @access  private/admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (category) {
    category.name = req.body.name || category.name
    category.description = req.body.description || category.description
    const updateCategory = await category.save()

    res.status(200).json(updateCategory)
  } else {
    res.status(404)
    throw new Error('Category not found')
  }
})

// @desc    Delete category
// @router  DELETE /api/categories/:id
// @access  private/admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id })

  if (category) {
    const alreadyHaveProducts = await Product.findOne({
      category: category._id,
    })
    if (alreadyHaveProducts) {
      res.status(400)
      throw new Error('Category already have products')
    } else {
      await category.delete()

      res.status(200).json({ message: 'Category deleted' })
    }
  } else {
    res.status(404)
    throw new Error('Category not found')
  }
})

// @desc    Force Delete category
// @router  DELETE /api/categories/:id/force
// @access  private/admin
const deleteCategoryForce = asyncHandler(async (req, res) => {
  const category = await Category.findOneWithDeleted({ _id: req.params.id })

  if (category) {
    await category.deleteOne()

    res.status(200).json({ message: 'Category deleted' })
  } else {
    res.status(404)
    throw new Error('Category not found')
  }
})

export {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteCategoryForce,
}
