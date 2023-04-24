const { RunSQL } = require("../db/db.fun");

router.post('/add/draft',async(req,res)=>{
    const{minusCount,minusPayment,bazanarx,allid,customername}=req.body;
    console.log(req.body)
    order_id="id" + Math.random().toString(16).slice(2)
    debtor_id="id" + Math.random().toString(16).slice(2)
    for(let i=0;i<req.body.minusCount.length;i++){
         data=await RunSQL("INSERT INTO draft(product_id,pr_count,price,sellprice,order_id,customername) Values(?,?,?,?,?,?)",[allid[i],minusCount[i],bazanarx[i],minusPayment[i],order_id,customername])
    console.log(data)
    }
    
})
router.get('/get/draft',checker,async(req,res)=>{
    let draftdata;
     if(req.query.name)
     draftdata=await RunSQL("SELECT order_id,customername,sum(pr_count*sellprice) as sum,cr_date FROM draft where customername like ?  group by order_id order by cr_date desc limit 100 offset ?",["%"+req.query.name+"%",(parseInt(req.query.getpage) - 1) * 100])
    else{
        draftdata=await RunSQL("SELECT order_id,customername,sum(pr_count*sellprice) as sum,cr_date FROM draft group by order_id order by cr_date desc limit 100 offset ?",[(parseInt(req.query.getpage) - 1) * 100])
    }
    console.log(draftdata)
    const count=await RunSQLOne("SELECT count(*) as cnt  FROM draft")
    res.render('draft',{
        dailydata:draftdata,
        count:count.cnt
    })
})
router.get('/get/draftinfo',checker,async(req,res)=>{
    let dailyinfodata;
     if (req.query.name){
         dailyinfodata=await RunSQL("select * from draft join products on products.product_id=draft.product_id  where draft.order_id=? and  products.name like ?",[req.query.order_id,"%"+req.query.name+"%"])
     }else if (req.query.barkod){
         dailyinfodata=await RunSQL("select * from draft join products on products.product_id=draft.product_id  where draft.order_id=? and products.barcode=?",[req.query.order_id,req.query.barkod])
     }else
     dailyinfodata=await RunSQL("select * from draft join products on products.product_id=draft.product_id  where draft.order_id=?",[req.query.order_id])
    
     res.render('draftinfo',{
         dailyinfodata:dailyinfodata,
         count:0
     })
 })
 router.get('/delete/draft',checker,async(req,res)=>{
    await RunSQL("delete from draft where order_id=?",[req.query.order_id])
    res.redirect('/get/draft');
 })
module.exports=router;