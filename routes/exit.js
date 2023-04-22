router.get('/exit',checker,async(req,res)=>{
        req.session.destroy()
    res.redirect('/user/sign-in')
})
module.exports=router;