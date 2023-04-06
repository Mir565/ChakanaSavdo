router.get('/user/dashboard',checker,(req,res)=>{
    res.render('dashboard')
})

router.get('/all/users',checker,async(req,res)=>{
    const data=await RunSQL("SELECT * FROM USERS")
    const count=await RunSQL("SELECT count(*) from USERS")
    res.render('alluser',{
        users:data,
        count:count
    })
})
module.exports=router;