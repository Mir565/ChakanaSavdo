const { RunSQL } = require("../db/db.fun")

router.get('/get/vazvrat',checker,async(req,res)=>{
    dailyinfodata=await RunSQL("select * from tranzactions join products on products.product_id=tranzactions.product_id  where order_id=? limit 4",[req.query.order_id])
    console.log(dailyinfodata)
    res.render('vazvrat',{
        dailyinfodata:dailyinfodata,
        count:0
    })
})
router.get('/get/vazvrat/searchby',async(req,res)=>{
    const data=await RunSQL("select * from tranzactions join products on products.product_id=tranzactions.product_id  where order_id=? and products.barcode=?",[req.query.order_id,req.query.barkod])
    res.json(data)
})
module.exports=router;