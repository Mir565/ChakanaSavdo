router.get('/all/tranzactions',checker,async(req,res)=>{
    let alltranz=[];
    let count={"count":0};
    if (req.query.month){
        alltranz=await RunSQL("SELECT * from tranzbyorderid where year(cr_date)=? and month(cr_date)=? and  organ_id=?  order by cr_date desc limit ? offset ?",[parseInt(req.query.month.split('-')[0]),parseInt(req.query.month.split('-')[1]),req.query.name,100,(parseInt(req.query.getpage)-1)*100]);
        count=await RunSQLOne("SELECT count(*) as count FROM tranzbyorderid where  year(cr_date)=? and month(cr_date)=?   and organ_id=?",[parseInt(req.query.month.split('-')[0]),parseInt(req.query.month.split('-')[1]),req.query.name]);    
    }
    else if (req.query.date){
        alltranz=await RunSQL("SELECT * from tranzbyorderid where date(cr_date)=? and  organ_id=?  order by cr_date desc limit ? offset ?",[req.query.date,req.query.name,100,(parseInt(req.query.getpage)-1)*100]);
        count=await RunSQLOne("SELECT count(*)as  count FROM tranzbyorderid where date(cr_date)=?  and organ_id=?",[req.query.date,req.query.name]);    
    }
    else if (req.query.name){
        alltranz=await RunSQL("SELECT * from tranzbyorderid where  organ_id=? order by cr_date desc limit ? offset ?",[req.query.name,100,(parseInt(req.query.getpage)-1)*100]);
        count=await RunSQLOne("SELECT count(*) as count FROM tranzbyorderid where  organ_id=?",[req.query.name]);    
    }
    const organs=await RunSQL("SELECT  * from organizations ")
    res.render('alltranz',{
        alltranz:alltranz,
        count:count.count,
        organs:organs
    })
})
router.get('/update/tranzactioninfo',checker,async(req,res)=>{
   
    let newCount=parseInt(req.query.count)-parseInt(req.query.prev_count);
    const updateitem=await RunSQL('UPDATE filial_count SET pr_count=pr_count+? where product_id=? and pr_user_id=?',[newCount,req.query.product_id,req.session.user_id])
   
    const data=await RunSQL('UPDATE organtranzactions SET pr_count=? where tranz_id=?',[parseInt(req.query.count),parseInt(req.query.tranz_id)])
    res.json({msg:'updated'})
})

router.get('/get/tranzactioninfo',checker,async(req,res)=>{
    let alltranzinfo;
    let count={"count":0};
    if (req.query.name){
        alltranzinfo=await RunSQL("SELECT  tr.*,pr.name,pr.barcode,pr.product_id FROM  organtranzactions tr join products pr on  pr.product_id=tr.product_id  where (order_id=? and name like ?) limit ? offset ?",[req.query.order_id,"%"+req.query.name+"%",100,(parseInt(req.query.getpage)-1)*100]);    
    console.log(alltranzinfo)
    }else
     alltranzinfo=await RunSQL("SELECT  tr.*,pr.name,pr.barcode,pr.product_id FROM  organtranzactions tr join products pr on  pr.product_id=tr.product_id  where order_id=? limit ? offset ?",[req.query.order_id,100,(parseInt(req.query.getpage)-1)*100]);
    
     count=await RunSQLOne("SELECT count(*) as count FROM  organtranzactions tr where order_id=?",[req.query.order_id]);
    console.log(count)
     res.render('alltranzinfo',{
        alltranzinfo:alltranzinfo,
        count:count.count
    })
}) 
module.exports=router