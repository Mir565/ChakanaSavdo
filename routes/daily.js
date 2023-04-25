const { RunSQL } = require("../db/db.fun");
const { checker } = require("../middleware/checkaccess")

router.get('/get/daily',checker,async(req,res)=>{
    let dailydata;
    await RunSQL("SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))")
    if (req.query.name && req.query.date){
        console.log(1)
        dailydata=await RunSQL("SELECT order_id,customername,sum(pr_count*sellprice) as sum,cr_date FROM tranzactions where DATE(cr_date)=?  and customername like ?  group by order_id order by cr_date desc limit 100 offset ?",[req.query.date,'%'+req.query.name+'%',(parseInt(req.query.getpage) - 1) * 100])     
    }
    else if(req.query.name)
        dailydata=await RunSQL("SELECT order_id,customername,sum(pr_count*sellprice) as sum,cr_date FROM tranzactions where customername like ?  group by order_id order by cr_date desc limit 100 offset ?",["%"+req.query.name+"%",(parseInt(req.query.getpage) - 1) * 100])
    else if(req.query.date){
        dailydata=await RunSQL("SELECT order_id,customername,sum(pr_count*sellprice) as sum,cr_date FROM tranzactions where DATE(cr_date)=?   group by order_id order by cr_date desc limit 100 offset ?",[req.query.date,(parseInt(req.query.getpage) - 1) * 100])
    }
    else{
        dailydata=await RunSQL("SELECT order_id,customername,sum(pr_count*sellprice) as sum,cr_date FROM tranzactions group by order_id order by cr_date desc limit 100 offset ?",[(parseInt(req.query.getpage) - 1) * 100])
    }
    console.log(dailydata)
    const count=await RunSQLOne("SELECT count(distinct order_id) as cnt  FROM tranzactions")
    res.render('daily',{
        dailydata:dailydata,
        count:count.cnt
    })
})
router.get('/get/dailyinfo',checker,async(req,res)=>{
   let dailyinfodata;
    if (req.query.name){
        dailyinfodata=await RunSQL("select * from tranzactions join products on products.product_id=tranzactions.product_id  where tranzactions.order_id=? and  products.name like ?",[req.query.order_id,"%"+req.query.name+"%"])
    }else if (req.query.barkod){
        dailyinfodata=await RunSQL("select * from tranzactions join products on products.product_id=tranzactions.product_id  where tranzactions.order_id=? and products.barcode=?",[req.query.order_id,req.query.barkod])
    }else
    dailyinfodata=await RunSQL("select * from tranzactions join products on products.product_id=tranzactions.product_id  where tranzactions.order_id=?",[req.query.order_id])
   
    res.render('dailyinfo',{
        dailyinfodata:dailyinfodata,
        count:0
    })
})
module.exports=router;