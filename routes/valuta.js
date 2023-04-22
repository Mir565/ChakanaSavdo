router.get('/get/valuta',checker,async(req,res)=>{
    const {kurs}=await RunSQLOne("select kurs from valuta")
    res.render('valuta',{
        kurs:kurs
    })
})
router.post('/get/valuta',checker,async(req,res)=>{
    await RunSQL("UPDATE valuta set kurs=? where kurs_id=1",[req.body.kurs])
    const {kurs}=await RunSQLOne("select kurs from valuta")
    res.render('valuta',{
        kurs:kurs
    })
})
module.exports=router;
