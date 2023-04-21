router.get('/get/benefit',async(req,res)=>{
    let data=[]
    if (req.query.month)
    data=await RunSQL("select sum(pr_count*(sellprice-price)) as summa,cr_date from tranzactions where year(cr_date)=? and  month(cr_date)=? group by DAte(cr_date)",[parseInt(req.query.month.split('-')[0]),parseInt(req.query.month.split('-')[1])]);
    else if (req.query.year){
        data=await RunSQL("select sum(pr_count*(sellprice-price)) as summa,month(cr_date) as cr_date from tranzactions where year(cr_date)=?  group by month(cr_date)",[parseInt(req.query.year)]);
    }
    res.render('benefit',{
        data:data,
        count:31 
       })
})
module.exports=router;
