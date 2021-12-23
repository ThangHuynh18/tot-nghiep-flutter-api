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
                  status: 'FINISH',
                  
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
                            localField: "_id",
                            foreignField: "_id",
                            as: "item" 
                      },
            },
            { 
                $project : {
                    _id : 1,
                    totalSell: 1,
                    name : "$item.name", 
                 
                } 
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
                      status: 'FINISH',
                      
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
                            localField: "_id",
                            foreignField: "_id",
                            as: "item" 
                      },
                },
                { 
                    $project : {
                        _id : 1,
                         totalSell: 1,
                        name : "$item.name", 

                    } 
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
                  status: 'FINISH',
                  
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
                      status: 'FINISH',
                      
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



// @desc        Statistic order sell by month
// @route       GET /api/dashboard/sale
// @access      Private/Admin
const saleMonth = asyncHandler(async (req, res, next) => {
  try {
    // const date = req.body.date
    const month = req.body.month;
//     console.log(
//       "🚀 ~ file: dashboardController.js ~ line 679 ~ saleMonth ~ month",
//       month
//     );
    const year = req.body.year;
    var dateEnd;
    var dateStart;

    if (
      month == 1 ||
      month == 3 ||
      month == 5 ||
      month == 7 ||
      month == 8 ||
      month == 10 ||
      month == 12
    ) {
      dateEnd = new Date(year, month, 1); // 31/12
      dateStart = new Date(year, month, -29);
      console.log("stat: " + dateStart.toISOString());
//       console.log(
//         "🚀 ~ file: dashboardController.js ~ line 662 ~ saleMonth ~ date",
//         new Date(dateEnd.toISOString())
//       );
      //console.log("dat: " + dateEnd.toDateString());
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
      dateEnd = new Date(year, month, 1); //
      dateStart = new Date(year, month, -28);
      console.log("stat: " + dateStart.toISOString());
//       console.log(
//         "🚀 ~ file: dashboardController.js ~ line 662 ~ saleMonth ~ date",
//         new Date(dateEnd.toISOString())
//       );
      //console.log("dat: " + dateEnd.toDateString());
    } else if (month == 2) {
      dateEnd = new Date(year, month, 1); //
      dateStart = new Date(year, month, -26);
      console.log("stat: " + dateStart.toISOString());
//       console.log(
//         "🚀 ~ file: dashboardController.js ~ line 662 ~ saleMonth ~ date",
//         new Date(dateEnd.toISOString())
//       );
      //console.log("dat: " + dateEnd.toDateString());
    }

    // var days = [];
    // while (date.getMonth() === month - 1) {
    //     date.setDate(date.getDate() + 1);
    //     console.log("🚀 ~ file: dashboardController.js ~ line 666 ~ saleMonth ~ date", date)
    //     days.push((date.getDate()))
    // }
    // console.log(
    //   "🚀 ~ file: dashboardController.js ~ line 687 ~ saleMonth ~ date",
    //   days
    // );
    // console.log("days length: " + days.length);
    // console.log("🚀 ~ file: dashboardController.js ~ line 675 ~ saleMonth ~ date.getMonth()", date.getMonth())
    // console.log("date year: " + date.getFullYear());

    // if (date.getMonth() === month - 1) {
    // console.log("month: "+month +" , year: "+year)

    const orders = await Order.aggregate([
      // {$project: {_id: 0, _month: {$month: '$createdAt'}}},
      {
        $match: {
          status: "FINISH",
        },
      },

      {
        $match: {
          createdAt: {
            // $gt: new Date(date.toString()+ "T00:00:00"),
            // $lte: new Date(date.toString() + "T23:59:59")
            //   $gte: new Date(year, month , 1).toISOString(),
            $gte: new Date(dateStart.toISOString()),
            $lte: new Date(dateEnd.toISOString()),
          },
        },
      },

      {
        $project: {
          totalPrice: 1,
          orderItems: 1,
          createdAt: 1,
        },
      },

      { $sort: { totalPrice: -1 } },
      // { $limit: 10 },
    ]);

    console.log("orders lenth: " + orders.length);
    var profit;
    let totalSell = 0;
    let countOrder = 0;
    // profit.push({
    //   countOrder: 0,
    //   totalSell: 0,
    // });

    orders.map((order) => {
      //month = JSON.stringify(order.createdAt).slice(6, 8);
      totalSell += parseInt(order.totalPrice);

      // profit[month - 1].countOrder++;
      // profit[month - 1].totalSell += totalSell;
      //totalSell = 0;
    });
    profit = {
      countOrder: orders.length,
      totalSell: totalSell,
    };

    res.status(200).json({ status: "success", data: profit, error: null });
    // } else res.status(200).json({ status: "failed", data: "", error: null });
  } catch (error) {
    res.status(400);
    throw new Error(`${error}`);
  }
});


export {
    productBestSeller,
    orderBetween,
    saleMonth,
}
