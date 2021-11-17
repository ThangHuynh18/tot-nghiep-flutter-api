import productRoutes from './productRoutes.js'
import userRoutes from './userRoutes.js'
import orderRoutes from './orderRoutes.js'
import uploadRoutes from './uploadRoutes.js'
import categoryRoutes from './categoryRoutes.js'
import brandRoutes from './brandRoutes.js'
import wishListRoutes from './wishListRoutes.js'
import supplierRoutes from './supplierRoutes.js'
import orderSupplierRoutes from './orderSupplierRoutes.js'
import importRoutes from './importRoutes.js'
import cartRoutes from './cartRoutes.js'
import dashboardRoutes from './dashboardRoutes.js'

const route = (app) => {
  app.use('/api/products', productRoutes)
  app.use('/api/users', userRoutes)
  app.use('/api/orders', orderRoutes)
  app.use('/api/upload', uploadRoutes)
  app.use('/api/categories', categoryRoutes)
  app.use('/api/brands', brandRoutes)
  app.use('/api/wishlist', wishListRoutes)
  app.use('/api/suppliers', supplierRoutes)
  app.use('/api/order-suppliers', orderSupplierRoutes)
  app.use('/api/imports', importRoutes)
  app.use('/api/cart', cartRoutes)
  app.use('/api/dashboard', dashboardRoutes)
}

export default route
