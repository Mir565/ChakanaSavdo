router.get('/all/tranzactions',async(req,res)=>{
    const alltranz=await RunSQL("SELECT * from tranzbyorderid where cr_date>=? and organ_id=? order by cr_date desc limit ? offset ?",[req.query.date,req.query.name,100,(parseInt(req.query.getpage)-1)*100]);
    const count=await RunSQLOne("SELECT count(*) as cnt FROM tranzbyorderid where cr_date>=? and organ_id=?",[req.query.date,req.query.name]);
    const organs=await RunSQL("SELECT * from organizations")
    res.render('alltranz',{
        alltranz:alltranz,
        count:count.cnt,
        organs:organs
    })
})
router.get('/update/tranzactioninfo',async(req,res)=>{
    console.log(req.query)
    let newCount=parseInt(req.query.count)-parseInt(req.query.prev_count);
    const updateitem=await RunSQL('UPDATE products SET pr_count=pr_count+? where product_id=?',[newCount,req.query.product_id])
    console.log(updateitem)
    const data=await RunSQL('UPDATE tranzactions SET pr_count=? where tranz_id=?',[parseInt(req.query.count),parseInt(req.query.tranz_id)])
    res.json({msg:'updated'})
})

router.get('/get/tranzactioninfo',async(req,res)=>{
    const alltranzinfo=await RunSQL("SELECT  tr.*,pr.name,pr.barcode,pr.product_id FROM  tranzactions tr join products pr on  pr.product_id=tr.product_id  where order_id=? limit ? offset ?",[req.query.order_id,100,(parseInt(req.query.getpage)-1)*100]);
   console.log(alltranzinfo)
    const count=await RunSQLOne("SELECT count(*) as cnt FROM  tranzactions tr where order_id=?",[req.query.order_id]);
    console.log(count)
    res.render('alltranzinfo',{
        alltranzinfo:alltranzinfo,
        count:count.cnt
    })
}) 
module.exports=router