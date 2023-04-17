
router.get('/get/vazvrat',checker,async(req,res)=>{
    dailyinfodata=await RunSQL("select * from tranzactions join products on products.product_id=tranzactions.product_id  where order_id=? limit 4",[req.query.order_id])
    res.render('vazvrat',{
        dailyinfodata:dailyinfodata,
        count:0
    })
})
router.get('/get/vazvrat/searchbybarkod',async(req,res)=>{
    const data=await RunSQL("select * from tranzactions join products on products.product_id=tranzactions.product_id  where order_id=? and products.barcode=?",[req.query.order_id,req.query.barkod])
    res.render('vazvrat',{
        dailyinfodata:data,
        count:0
    })
})
router.get('/get/vazvrat/searchbytext',async(req,res)=>{
    const data=await RunSQL("select * from tranzactions join products on products.product_id=tranzactions.product_id  where order_id=? and products.name like ?",[req.query.order_id,"%"+req.query.name+"%"])
    res.render('vazvrat',{
        dailyinfodata:data,
        count:0
    })
})
router.post('/post/vazvrat',async(req,res)=>{
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
router.get('/get/vazvratinfo',async(req,res)=>{
    dailyinfovazvratdata=await RunSQL("select * from vazvrat join products on products.product_id=vazvrat.product_id  where order_id=?",[req.query.order_id])
    res.render('vazvratinfo',{
        dailyinfodata:dailyinfovazvratdata,
        count:0
    })
})
module.exports=router;