
router.get('/get/vazvrat',checker,async(req,res)=>{
    dailyinfodata=await RunSQL("select * from tranzactions join products on products.product_id=tranzactions.product_id  where order_id=? limit 4",[req.query.order_id])
    res.render('vazvrat',{
        dailyinfodata:dailyinfodata,
        count:0
    })
})
router.get('/all/vazvrats',checker,async(req,res)=>{
    let dailydata;
    if (req.query.name && req.query.date){
        console.log(1)
        dailydata=await RunSQL("SELECT order_id,customername,sum(vazvratcount*vazvratprice) as sum,cr_date FROM vazvrat where DATE(cr_date)=?  and customername like ?  group by vaz_order_id order by cr_date desc limit 100 offset ?",[req.query.date,'%'+req.query.name+'%',(parseInt(req.query.getpage) - 1) * 100])     
    }
    else if(req.query.name)
        dailydata=await RunSQL("SELECT order_id,customername,sum(vazvratcount*vazvratprice) as sum,cr_date FROM vazvrat where customername like ?  group by vaz_order_id order by cr_date desc limit 100 offset ?",["%"+req.query.name+"%",(parseInt(req.query.getpage) - 1) * 100])
    else if(req.query.date){
        dailydata=await RunSQL("SELECT order_id,customername,sum(vazvratcount*vazvratprice) as sum,cr_date FROM vazvrat where DATE(cr_date)=?   group by vaz_order_id order by cr_date desc limit 100 offset ?",[req.query.date,(parseInt(req.query.getpage) - 1) * 100])
    }
    else{
        dailydata=await RunSQL("SELECT order_id,customername,sum(vazvratcount*vazvratprice) as sum,cr_date FROM vazvrat group by vaz_order_id order by cr_date desc limit 100 offset ?",[(parseInt(req.query.getpage) - 1) * 100])
    }
    const count=await RunSQLOne("SELECT count(*) as cnt  FROM vazvrat")
    res.render('allvazvrat',{
        dailydata:dailydata,
        count:count.cnt
    })
})
router.get('/get/vazvrat/searchbybarkod',checker,async(req,res)=>{
    const data=await RunSQL("select * from tranzactions join products on products.product_id=tranzactions.product_id  where order_id=? and products.barcode=?",[req.query.order_id,req.query.barkod])
    res.render('vazvrat',{
        dailyinfodata:data,
        count:0
    })
})
router.get('/get/vazvrat/searchbytext',checker,async(req,res)=>{
    const data=await RunSQL("select * from tranzactions join products on products.product_id=tranzactions.product_id  where order_id=? and products.name like ?",[req.query.order_id,"%"+req.query.name+"%"])
    res.render('vazvrat',{
        dailyinfodata:data,
        count:0
    })
})
router.post('/post/vazvrat',checker,async(req,res)=>{
    const data=req.body.data;
    vaz_order_id="id" + Math.random().toString(16).slice(2)
    for(let i=0;i<data.length;i++){
        dataold=data[i].old;
        const {count}=await RunSQLOne("select count(*) as count from vazvrat where order_id=? and product_id=?",[dataold.order_id,dataold.product_id]);
        if (count>0){
          const error= await RunSQL("UPDATE vazvrat set vazvratcount=vazvratcount+?,vazvratprice=? where order_id=? and product_id=?",[data[i].vazvratcount,data[i].vazvratprice,dataold.order_id,dataold.product_id])
          await RunSQL("UPDATE tranzactions set pr_count=pr_count-? where order_id=? and product_id=?",[data[i].vazvratcount,dataold.order_id,dataold.product_id])
        }else{
        const datas=await RunSQL("INSERT INTO vazvrat(product_id,pr_count,sellprice,customername,curiername,vaz_order_id,vazvratcount,vazvratprice,order_id)values(?,?,?,?,?,?,?,?,?)",[dataold.product_id,dataold.pr_count,dataold.sellprice,dataold.customername,dataold.curiername,vaz_order_id,data[i].vazvratcount,data[i].vazvratprice,dataold.order_id])
        await RunSQL("UPDATE tranzactions set pr_count=pr_count-? where order_id=? and product_id=?",[data[i].vazvratcount,dataold.order_id,dataold.product_id])
    }  
}
   res.json({"data":1})
})
router.get('/get/vazvratinfo',checker,async(req,res)=>{
    let dailyinfovazvratdata;
    if (req.query.name){
        dailyinfovazvratdata=await RunSQL("select * from vazvrat join products on products.product_id=vazvrat.product_id  where vazvrat.order_id=? and  products.name like ?",[req.query.order_id,"%"+req.query.name+"%"])
    }else if (req.query.barkod){
        dailyinfovazvratdata=await RunSQL("select * from vazvrat join products on products.product_id=vazvrat.product_id  where vazvrat.order_id=? and products.barcode=?",[req.query.order_id,req.query.barkod])
    }else
    dailyinfovazvratdata=await RunSQL("select * from vazvrat join products on products.product_id=vazvrat.product_id  where vazvrat.order_id=?",[req.query.order_id])

    res.render('vazvratinfo',{
        dailyinfodata:dailyinfovazvratdata,
        count:0
    })
})
module.exports=router;