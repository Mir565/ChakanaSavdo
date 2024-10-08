router.get('/get/debt',checker,async(req,res)=>{
    const debtor=await RunSQL("select * from debtor where debtor_name like ? limit 100 offset ?",["%"+req.query.debtor_name+"%",(parseInt(req.query.getpage) - 1) * 100]);
    const count =await RunSQLOne("select  count(*) as cnt from debtor");

    res.render('debt',{
        debtor:debtor,
        count:count.cnt
    })
})
// router.get('/delete/debt/',checker,async(req,res)=>{
//     await RunSQL("delete from debtor where debtor_id=?",[req.query.debtor_id]);
//     await RunSQL("delete from debt where debtor_id=?",[req.query.debtor_id]);
//     await RunSQL("delete from paydebt where debtor_id=?",[req.query.debtor_id]);
// })
router.get('/get/debtinfo',checker,async(req,res)=>{
    let debtor;
    if (req.query.date){
        debtor=await RunSQL("select * from debt where debtor_id=? and DATE(cr_date)=? limit 100 offset ?",[req.query.debtor_id,req.query.date,(parseInt(req.query.getpage) - 1) * 100]);
    }
    else{
        debtor=await RunSQL("select * from debt where debtor_id=? limit 100 offset ?",[req.query.debtor_id,(parseInt(req.query.getpage) - 1) * 100]);
    }
    const {payed}=await RunSQLOne("select sum(cash)+sum(card)+sum(transfer) as payed from payeddebt where debtor_id=?",[req.query.debtor_id])
    const {alldebt}=await RunSQLOne("select sum(debt) as alldebt from debt where debtor_id=?",[req.query.debtor_id])
    const count =await RunSQLOne("select  count(*) as cnt from debt where debtor_id=?",[req.query.debtor_id]);
    const {debtor_name}=await RunSQLOne("select debtor_name from debtor where debtor_id=?",[req.query.debtor_id])
    res.render('debtorinfo',{
        debtor:debtor,
        payed:payed,
        alldebt:alldebt,
        count:count.cnt,
        debtor_name:debtor_name
    })
})
router.get('/paydebt',checker,async(req,res)=>{
    const {payeddebt}=await RunSQLOne("select sum(cash)+sum(card)+sum(transfer) as payeddebt from payeddebt where debtor_id=?",[req.query.debtor_id])
    const {alldebt}=await RunSQLOne("select sum(debt) as alldebt from debt where debtor_id=?",[req.query.debtor_id])
    const {debtor_name}=await RunSQLOne("select debtor_name from debtor where debtor_id=?",[req.query.debtor_id])
    res.render('paydebt',{
        clas:"success",
        message:"",
        payeddebt:payeddebt,
        alldebt:alldebt,
        debtor_name:debtor_name
    })
})
router.post('/paydebt',checker,async(req,res)=>{
    console.log(req.query)
    const{cash,moneytransfer,card}=req.body;
    const data=await RunSQL("INSERT INTO payeddebt(cash,card,transfer,debtor_id)Values(?,?,?,?)",[cash,card,moneytransfer,req.query.debtor_id])
   console.log(data)
    res.redirect('/get/debt')   
})
router.get('/paydebtinfo',checker,async(req,res)=>{
    let payed;
    if (req.query.date){
    payed=await RunSQL("select * from payeddebt where debtor_id=? and DATE(cr_date)=?  limit 100 offset ?",[req.query.debtor_id,req.query.date,(parseInt(req.query.getpage) - 1) * 100])
    }
    else{
        payed=await RunSQL("select * from payeddebt where debtor_id=? limit 100 offset ?",[req.query.debtor_id,(parseInt(req.query.getpage) - 1) * 100])
    }
    const count =await RunSQLOne("select  count(*) as cnt from payeddebt where debtor_id=?",[req.query.debtor_id])
    const {payeddebt}=await RunSQLOne("select sum(cash)+sum(card)+sum(transfer) as payeddebt from payeddebt where debtor_id=?",[req.query.debtor_id])
    const {alldebt}=await RunSQLOne("select sum(debt) as alldebt from debt where debtor_id=?",[req.query.debtor_id])
    const {debtor_name}=await RunSQLOne("select debtor_name from debtor where debtor_id=?",[req.query.debtor_id])
    res.render("payeddebtinfo",{
        payed:payed,
        count:count.cnt,
        payeddebt:payeddebt,
        alldebt:alldebt,
        debtor_name:debtor_name
    })
})
module.exports=router;