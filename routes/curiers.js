router.get('/curiers',async(req,res)=>{
    let data;
    if (req.query.name){
data=await RunSQL("select * from curiers where curiername like ?",["%"+req.query.name+"%"]);
    }else
     data=await RunSQL("select * from curiers");
    res.render('curier',{
        data:data
    });
})
router.get('/nol/curiers',async(req,res)=>{
    await RunSQL("UPDATE curiers set benefit=0 where curier_id=?",[req.query.curier_id])
    const data=await RunSQL("select * from curiers");
    res.render('curier',{
        data:data
    });
})
module.exports=router;