router.get('/get/rol',checker,async(req,res)=>{
    res.json({"user":req.session.email,"rol":req.session.rol})
})
router.get('/get/rolchange',checker,async(req,res)=>{
   
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