router.get('/get/debt',checker,async(req,res)=>{
    const debtor=await RunSQL("select * from debtor  limit 100 offset ?",[(parseInt(req.query.getpage) - 1) * 100]);
    const count =await RunSQLOne("select  count(*) as cnt from debtor");
    console.log(count)
    res.render('debt',{
        debtor:debtor,
        count:count.cnt
    });
})
router.get('/get/debtinfo',checker,async(req,res)=>{
    const debtor=await RunSQL("select * from debt where debtor_id=? limit 100 offset ?",[req.query.debtor_id,(parseInt(req.query.getpage) - 1) * 100]);
    const count =await RunSQLOne("select  count(*) as cnt from debt");
    console.log(count)
    res.render('debtorinfo',{
        debtor:debtor,
        count:count.cnt
    });
})
module.exports=router;