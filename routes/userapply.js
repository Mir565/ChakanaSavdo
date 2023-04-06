router.get('/user/sign-up',(req,res)=>{
    res.render('apply',{
        message:""
    })
})
router.post('/user/sign-up',async(req,res)=>{
    const{firstname,lastname,email,pass}=req.body;
    const data= await RunSQL("INSERT INTO USERS(firstname,lastname,email,pass)values(?,?,?,?)",[firstname,lastname,email,pass])
    if(data.err){
        res.render('apply',{
            message:"Malumotlarni kiritishda xatolik!"
        })
    }else{
        req.session.email=email;
        res.json({data:"Ok"})
    }
})
module.exports=router;