const checkerAdmin=async(req,res,next)=>{
    if (req.session.rol=="admin"){
        console.log(req.session.rol)
        next()
    }
    else{
        res.render("404")
    }
}
module.exports={checkerAdmin};