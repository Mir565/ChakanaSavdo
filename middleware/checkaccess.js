const checker=async(req,res,next)=>{
    if (req.session.email){
       
        next()
    }
    else{
        res.redirect('/user/sign-in')
    }
}
module.exports={checker};