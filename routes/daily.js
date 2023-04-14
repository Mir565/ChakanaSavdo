const { checker } = require("../middleware/checkaccess")

router.get('/get/daily',checker,async(req,res)=>{
    const dailydata=await RunSQL("SELECT order_id,customername,sum(pr_count*sellprice) as sum,cr_date FROM tranzactions  group by order_id order by cr_date desc limit 100 offset ?",[(parseInt(req.query.getpage) - 1) * 100])
    const count=await RunSQLOne("SELECT count(*) as cnt  FROM tranzactions")
    res.render('daily',{
        dailydata:dailydata,
        count:count.cnt
    })
})
router.get('/get/dailyinfo',checker,async(req,res)=>{
    dailyinfodata=await RunSQL("select * from tranzactions join products on products.product_id=tranzactions.product_id  where order_id=?",[req.query.order_id])
    console.log(dailyinfodata)
    res.render('dailyinfo',{
        dailyinfodata:dailyinfodata,
        count:0
    })
})
module.exports=router;