router.get('/get/rol',async(req,res)=>{
    await new Promise(resolve => setTimeout(resolve, 50));
    res.json({"user":req.session.email,"rol":req.session.rol})
})
router.get('/get/rolchange',checker,async(req,res)=>{
    console.log(req.query)
    req.session.email=req.query.email;
    req.session.user_id=req.query.user_id;
    const data=await RunSQL("SELECT * FROM USERS")
    const count=await RunSQL("SELECT count(*) from USERS")
    res.render('alluser',{
        users:data,
        count:count
    })
})
module.exports=router