router.post('/add/organizations',async(req,res)=>{
    const organname=req.body.organname.trim();
    const organ=await RunSQL("INSERT INTO organizations(organ_name)values(?)",[organname])
    if(organ.err)
    res.render('xarajat',{
        clas:'btn-danger',
        message:'Kechirasiz xatolik!!'
    })
    else{
        res.render('xarajat',{
            clas:'btn-success',
            message:'yaratildi'
        })
    }
}) 
router.get('/add/organizations',async(req,res)=>{
    res.render('xarajat',{
        clas:'',
        message:""
    })
})
router.get('/all/organizations',async(req,res)=>{
    const organs=await RunSQL("Select * from organizations where organ_name like ? Limit  ? Offset ?",['%'+req.query.organ_name+'%',100,(parseInt(req.query.getpage)-1)*100])
    const count=await RunSQLOne('Select count(*) as cnt from organizations');
    res.render('allorganizations',{
        organs:organs,
        count:count.cnt
    })
})


module.exports=router