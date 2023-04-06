router.get('/exit',async(req,res)=>{
        req.session.destroy()
    res.redirect('/user/sign-in')
})
module.exports=router;