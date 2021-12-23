import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import Import from "../models/importModel.js";
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


class Obj {
  constructor(productId, price) {
    this.productId = productId;
    this.price = price;
  }
}

class ObjOrder {
  constructor(productId, price, qty) {
    this.productId = productId;
    this.price = price;
    this.qty = qty;
  }
}


// @desc        Statistic profit by month
// @route       GET /api/dashboard/profit
// @access      Private/Admin
const profitMonth = asyncHandler(async (req, res, next) => {
  try {
    //const date = req.body.date;
    //const dateTo = req.body.dateTo

    const month = req.body.month;
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
      dateEnd = new Date(year, month, 1); // 31/12 / tìm 1/12 đi
      dateStart = new Date(year, month, -29);
      console.log("stat: " + dateStart.toISOString());
      //console.log("dat: " + dateEnd.toDateString());
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
      dateEnd = new Date(year, month, 1); //
      dateStart = new Date(year, month, -28);
      console.log("stat: " + dateStart.toISOString());
      //console.log("dat: " + dateEnd.toDateString());
    } else if (month == 2) {
      dateEnd = new Date(year, month, 1); //
      dateStart = new Date(year, month, -26);
      console.log("stat: " + dateStart.toISOString());
      //console.log("dat: " + dateEnd.toDateString());
    }

    const orderImports = await Import.aggregate([
      {
        $match: {
          status: "FINISH",
        },
      },

      {
        $match: {
          createdAt: {
            // $gt: new Date(date.toString() + "T00:00:00"),
            // $lte: new Date(date.toString() + "T23:59:59"),
            $gte: new Date(dateStart.toISOString()),
            $lte: new Date(dateEnd.toISOString()),
          },
        },
      },

      {
        $project: {
          totalPrice: 1,
          importItems: 1,
          createdAt: 1,
        },
      },

      { $sort: { totalPrice: -1 } },
      // { $limit: 10 },
    ]);

    const orders = await Order.aggregate([
      {
        $match: {
          status: "FINISH",
        },
      },

      {
        $match: {
          createdAt: {
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

   
    var array = [];

    //order import
    var arrId = [];
    var array2 = [];

      for (let i = 0; i < orderImports.length; i++) {
        for (let j = 0; j < orderImports[i].importItems.length; j++) {
          const obj = new Obj();
          obj.productId = orderImports[i].importItems[j].product;
          obj.price = orderImports[i].importItems[j].price;
          array2.push(obj);
        }
      }

      for (let a = 0; a < array2.length; a++) {
        var index = arrId.findIndex((ab) => ab === array2[a].productId.toString());

        if (index === -1) {
          const obj2 = new Obj();
          obj2.productId = array2[a].productId;
          obj2.price = [Number(array2[a].price)];
          array.push(obj2);
          arrId.push(array2[a].productId.toString());
        } else {
          array[index].price.push(Number(array2[a].price)) ;
        }
      }
    // orderImports.map((pn) => {
    //   totalPriceImport += parseInt(pn.totalPrice);

    //     //console.log("array lenggth 1 : " + array.length)

    //       for(var i=0; i<pn.importItems.length; i++){
            
    //         const obj = new Obj();
    //         obj.productId = pn.importItems[i].product;
    //         obj.price = [pn.importItems[i].price];
    //         if(array.length == 0){
    //               array.push(obj)
    //               console.log("arr; "+array[0].productId)
    //         } else {
    //           // console.log("item id: " + pn.importItems[i].product);
    //           // console.log(" array[i].productId: " + array[i].productId);
    //             if(array[i].productId.toString()===obj.productId.toString()){
    //               array[i].price.push(pn.importItems[i].price);
    //             } else {
    //               console.log("object================="+i)
    //               array.push(obj)
    //             }
    //         }
             
    //       }

          // var index = array.findIndex((x) => 
          //   { 
          //     console.log("x id: "+x.productId)
          //     console.log("it id: "+item.product)
          //     var a = x.productId
          //     var b = item.product
          //     new String(a.toString()).valueOf() == new String(b.toString()).valueOf()
          //     }
          //   );
          // console.log("index: " + index);

          // var ele = array.find((x) => 
          //   { console.log("x id: "+x.productId)
          //     console.log("it id: "+item.product)
          //     x.productId.toString() === item.product.toString()});

          //     console.log("object id: "+ele.productId)
          //     console.log("object price: "+ele.price)


          // if (index != -1) {
          //   console.log("aaaaaaaaaa")
          //   array[index].price.push(item.price);
          // } else {
          //   array.push(obj);
          // }
        

        //console.log("ARRAY: "+)
        //   var index = array.map(function(e){
        //     console.log("fffffffffff: "+e.productId)
        //     console.log("vvvvvvv: "+obj.productId)
        //     return e.productId;
        // }).indexOf(obj.productId);
        // console.log("index: "+index)

        // if(index === -1){
        //   array.push(obj)
        // } else{
        //   array[index].price.push(item.price)
        // }
      
      // console.log("array lenggth: " + array.length);
      //console.log("price [0]: "+array[0].price.length)
      // productIdArr.idProImport += item.product
      // productIdArr.priceImport = item.price

      // element.totalPriceImport += parseInt(pn.totalPrice)
    // });
    // console.log("object product: " + array);

    //order

    var arrIdOrder = [];
    var array2Order = [];
    var arrayOrder = [];

    var kq = 0
    

      for (let i = 0; i < orders.length; i++) {
        for (let j = 0; j < orders[i].orderItems.length; j++) {
          const obj = new ObjOrder();
          obj.productId = orders[i].orderItems[j].product;
          obj.price = orders[i].orderItems[j].price;
          obj.qty = orders[i].orderItems[j].qty;
          array2Order.push(obj);
        }
      }

      for (let a = 0; a < array2Order.length; a++) {
        var index = arrIdOrder.findIndex((ab) => ab === array2Order[a].productId.toString());

        if (index === -1) {
          const obj2 = new ObjOrder();
          obj2.productId = array2Order[a].productId;
          obj2.price = [Number(array2Order[a].price)];
          obj2.qty = Number(array2Order[a].qty);
          arrayOrder.push(obj2);
          arrIdOrder.push(array2Order[a].productId.toString());
        } else {
          arrayOrder[index].price.push(Number(array2Order[a].price)) ;
          arrayOrder[index].qty += Number(array2Order[a].qty) ;
        }
      }

      for(let i=0; i<arrayOrder.length; i++){
        for(let j=0; j<array.length; j++){
          if(arrayOrder[i].productId.toString() === array[j].productId.toString()){
            var sumOrder = arrayOrder[i].price.reduce((partial_sum, a) => partial_sum + a, 0);
            var avgSumOrder = sumOrder / arrayOrder[i].price.length

            var sumImport = array[j].price.reduce((partial_sum, a) => partial_sum + a, 0);
            var avgSumImport = sumImport / array[j].price.length

            kq += (avgSumOrder - avgSumImport) * arrayOrder[i].qty
          }
        }
      }
    // orders.map((order) => {
    //   totalPriceOrder += parseInt(order.totalPrice);



      // productIdArr.idProOrder += item.product
      // productIdArr.priceOrder = item.price

      //element.totalPriceOrder += parseInt(order.totalPrice);
    // });

    // if(productIdArr.idProImport === productIdArr.idProOrder){

    // }
    // countImport = orderImports.length;
    // countOrder = orders.length;
    // avgImportPrice = Math.floor(totalPriceImport / countImport);
    // avgOrderPrice = Math.floor(totalPriceOrder / countOrder);
    // console.log("avgImport: " + avgImportPrice);
    // console.log("avgOrder: " + avgOrderPrice);
    // profitPrice = parseFloat(avgOrderPrice - avgImportPrice);
    // var element = {
    //   countImport: countImport,
    //   countOrder: countOrder,
    //   totalPriceImport: totalPriceImport,
    //   totalPriceOrder: totalPriceOrder,
    //   profitPrice: profitPrice,
    // };
    //statisticProfitYear.push({ ...productIdArr });
    res.status(200).json({ status: "success", data: kq, error: null });
  } catch (error) {
    res.status(400);
    throw new Error(`${error}`);
  }
});


export {
    productBestSeller,
    orderBetween,
    saleMonth,
    profitMonth,
}
