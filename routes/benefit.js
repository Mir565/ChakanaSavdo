router.get('/get/benefit',checker,async(req,res)=>{
    let {kurs}=await RunSQLOne("select kurs from valuta")
    console.log(kurs)
    let data=[]
    const {uzsdata}=await RunSQLOne("select sum((sell_price-price)*pr_count) as uzsdata from products p join filial_count f on f.product_id=p.product_id where p.ISSUM=1")
    const {usddata}=await RunSQLOne("select sum((sell_price-price)*pr_count) as usddata from products p join filial_count f on f.product_id=p.product_id where p.ISSUM=0")
    console.log(uzsdata)
    if (req.query.month)
    data=await RunSQL("select sum(pr_count*(sellprice-price)) as summa,cr_date from tranzactions where year(cr_date)=? and  month(cr_date)=? group by DAte(cr_date)",[parseInt(req.query.month.split('-')[0]),parseInt(req.query.month.split('-')[1])]);
    else if (req.query.year){
        data=await RunSQL("select sum(pr_count*(sellprice-price)) as summa,month(cr_date) as cr_date from tranzactions where year(cr_date)=?  group by month(cr_date)",[parseInt(req.query.year)]);
    }
    res.render('benefit',{
        data:data,
        uzsdata:uzsdata,
        usddata:usddata,
        allsumma:parseInt(uzsdata)+parseInt(usddata*kurs),
        count:31 
       })
})
module.exports=router;
