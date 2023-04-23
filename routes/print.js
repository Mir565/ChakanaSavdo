
router.get('/print',checker,(req,res)=>{
    res.render('print',{
        cusname:req.query.cusname,
        arrayname:req.query.arrayname.split(','),
        arraycount:req.query.arraycount.split(','),
        arrayprice:req.query.arrayprice.split(',')
    })
})
router.get('/print/vazvrat',checker,async(req,res)=>{
    dailyinfovazvratdata=await RunSQL("select * from vazvrat join products on products.product_id=vazvrat.product_id  where vazvrat.order_id=?",[req.query.order_id])
    res.render('printvazvrat',{
        data:dailyinfovazvratdata
    })
})
router.get('/print/vazvrat/current',checker,async(req,res)=>{
    res.render('printvazvratcurrent',{
        data:JSON.parse(req.query.data)
    })
})
router.get('/print/customer/history',checker,async(req,res)=>{
    res.render('printxaridor',{
        data:JSON.parse(req.query.data)
    })
})
module.exports=router;