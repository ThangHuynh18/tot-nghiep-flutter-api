import asyncHandler from 'express-async-handler'
import Brand from '../models/brandModel.js'
import Product from '../models/productModel.js'


// @desc    Fetch all brands
// @router  GET /api/brands
// @access  public
const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({}).sort({ createdAt: 'desc' })

  res.json(brands)
})

// @desc    Fetch all brands
// @router  POST /api/brands
// @access  private/admin
const createBrand = asyncHandler(async (req, res) => {
  const { name, description } = req.body

  const brandExist = await Brand.findOne({ name })

  if (brandExist) {
    res.status(400)
    throw new Error('Brand already exists')
  }

  const brand = await Brand.create({ name, description })

  if (brand) {
    res.status(201).json(brand)
  } else {
    res.status(400)
    throw new Error('Brand not found')
  }
})

// @desc    Update brands
// @router  PUT /api/brands/:id
// @access  private/admin
const updateBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id)

  if (brand) {
    brand.name = req.body.name || brand.name
    brand.description = req.body.description || brand.description
    const updateBrand = await brand.save()

    res.status(200).json(updateBrand)
  } else {
    res.status(404)
    throw new Error('Brand not found')
  }
})

// @desc    Delete brands
// @router  DELETE /api/brands/:id
// @access  private/admin
const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id)

  if (brand) {
    //check this brand already have product ?
    const alreadyHaveProducts = await Product.findOne({
      brand: brand._id,
    })
    if (alreadyHaveProducts) {
      res.status(400)
      throw new Error('Brand already have products')
    } else {
      await brand.delete()

      res.status(200).json({ message: 'Brand deleted' })
    }
  } else {
    res.status(404)
    throw new Error('Brand not found')
  }
})

// @desc    Force Delete brands
// @router  DELETE /api/brands/:id/force
// @access  private/admin
const deleteBrandForce = asyncHandler(async (req, res) => {
  const brand = await Brand.findOneWithDeleted({ _id: req.params.id })

  if (brand) {
    const alreadyHaveProducts = await Product.findOne({
      brand: brand._id,
    })
    if (alreadyHaveProducts) {
      res.status(400)
      throw new Error('Brand already have products')
    } else {
      await brand.deleteOne()
      res.status(200).json({ message: 'Brand deleted' })
    }
    
  } else {
    res.status(404)
    throw new Error('Brand not found')
  }
})

export { getBrands, createBrand, updateBrand, deleteBrand, deleteBrandForce }
