const checkerAdmin=async(req,res,next)=>{
    if (req.session.rol=="admin"){
      
        next()
    }
    else{
        res.render("404")
    }
}
module.exports={checkerAdmin};