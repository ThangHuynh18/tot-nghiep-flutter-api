import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'


// @desc        Statistic product best seller between date
// @route       GET /api/dashboard/product
// @access      Private/Admin
const productBestSeller = asyncHandler(async (req, res, next) => {
    try {
        const dateFrom = req.body.dateFrom
        const dateTo = req.body.dateTo

        if (dateFrom && dateTo) {
            
            console.log("from: "+dateFrom)
            console.log("to : "+dateTo)
            // var part1 = dateFrom.split('-')
            // var part2 = dateTo.split('-')

            // var from = new Date();
            // from.setFullYear(part1[0], part1[1], part1[2]);
            // var to = new Date();
            // to.setFullYear(part2[0], part2[1], part2[2]);

            
            

        const bestSeller = await Order.aggregate([
            {
                $match: {
                  status: 'ACCEPT',
                  
                },
            },

              {
                $match: { 
                    "createdAt": {
                        $gte: new Date(dateFrom.toString()),
                        $lte: new Date(dateTo.toString() + "T23:59:59")
                    }
                }
              },
            
            {
            $unwind: { path: '$orderItems' },
            },
            {
            $group: {
                _id: '$orderItems.product',
//                 name: { $first: '$orderItems.product.name' },
//                 name: { $lookup: {
//                             from: "products",
//                             localField: "product",
//                             foreignField: "_id",
//                             as: "item"
//                         },
//                       },
                totalSell: { $sum: '$orderItems.qty' },
            },
            },
            {
                $lookup: {
                            from: "products",
                            localField: "_id.product",
                            foreignField: "_id",
                            as: "item" 
                      },
            },
            { $sort: { totalSell: -1 } },
            { $limit: 10 },
        ])
    
        res.status(200).json({ status: 'success', data: bestSeller, error: null })
        } else {
//             res.status(404)
//             throw new Error('Not found date')
            const bestSeller = await Order.aggregate([
                {
                    $match: {
                      status: 'ACCEPT',
                      
                    },
                },
                {
                $unwind: { path: '$orderItems' },
                },
                {
                $group: {
                    _id: '$orderItems.product',
                   // name: { $first: '$orderItems.product.name' },
//                      name: { $lookup: {
//                             from: "products",
//                             localField: "product",
//                             foreignField: "_id",
//                             as: "item"
//                         },
//                       },
                    totalSell: { $sum: '$orderItems.qty' },
                },
                },
                
                {
                    $lookup: {
                            from: "products",
                            localField: "_id.product",
                            foreignField: "_id",
                            as: "item" 
                      },
                },
                
                { $sort: { totalSell: -1 } },
                { $limit: 10 },
            ])
        
            res.status(200).json({ status: 'success', data: bestSeller, error: null })
        }
    } catch (error) {
      res.status(400)
      throw new Error(`${error}`)
    }
  })


// @desc        Statistic order between date
// @route       GET /api/dashboard/product
// @access      Private/Admin
const orderBetween = asyncHandler(async (req, res, next) => {
    try {
        const dateFrom = req.body.dateFrom
        const dateTo = req.body.dateTo

        if (dateFrom && dateTo) {
            
            console.log("from: "+dateFrom)
            console.log("to : "+dateTo)

        const orders = await Order.aggregate([
            {
                $match: {
                  status: 'ACCEPT',
                  
                },
            },

            {
                $match: { 
                    "createdAt": {
                        $gte: new Date(dateFrom.toString()),
                        $lte: new Date(dateTo.toString() + "T23:59:59")
                    }
                }
            },

            { 
                $project : { 
                    totalPrice : 1 , 
                    orderItems : 1 , 
                    createdAt: 1 
                } 
            },
           
            { $sort: { totalPrice: -1 } },
            { $limit: 10 },
        ])
    
        res.status(200).json({ status: 'success', data: orders, error: null })
        } else {
//             res.status(404)
//             throw new Error('Not found date')
            const orders = await Order.aggregate([
                {
                    $match: {
                      status: 'ACCEPT',
                      
                    },
                },
    
                { 
                    $project : { 
                        totalPrice : 1 , 
                        orderItems : 1 , 
                        createdAt: 1 
                    } 
                },
               
                { $sort: { totalPrice: -1 } },
                { $limit: 10 },
            ])
        
            res.status(200).json({ status: 'success', data: orders, error: null })
        }
    } catch (error) {
      res.status(400)
      throw new Error(`${error}`)
    }
  })


export {
    productBestSeller,
    orderBetween,
}
