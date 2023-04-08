
router.get('/mag/get/sell',async(req,res)=>{
    const items =[]
    const organs=await RunSQL("SELECT * from users")
    res.render('magsell',{
        allitems:items,
        organs:organs
    })
})
router.post('/mag/add/sell',async(req,res)=>{
    console.log(req.body)
    console.log(req.session.user_id)
    const{pulkochrish,plastik,naqd,minusName,minusCount,minusPayment,bazanarx,barkod,idfornews,organid,curiername,summa,allid}=req.body;
    let inserting=[]
    let updating=[]
    let insertfortranz=[]
    let inserttranzfororgan=[]
    order_id="id" + Math.random().toString(16).slice(2)
    inserttranzfororgan.push([curiername,summa,organid,order_id])
    for(let i=0;i<req.body.minusName.length;i++){
        insertfortranz.push([allid[i],minusCount[i],req.session.user_id,order_id])
        await RunSQL("UPDATE filial_count SET  pr_count=pr_count-? WHERE product_id=? and pr_user_id=?",[minusCount[i],allid[i],req.session.user_id])
}
await RunSQL("INSERT INTO ALLSUMMA(cash,card,transfer,order_id,user_id) VALUES (?,?,?,?,?)",[parseInt(naqd),plastik,pulkochrish,order_id,req.session.user_id])

await RunSQL("INSERT INTO tranzfilial(product_id,pr_count,magid,order_id) VALUES ?",[insertfortranz])
res.json({})
// const insertingfortranz=await RunSQL("INSERT INTO tranzactions(pr_name, barcode,pr_count, price,organ_id,order_id) VALUES ?",[insertfortranz]) 
})

router.get('/get/sell',async(req,res)=>{
    const items =[]
    const organs=await RunSQL("SELECT * from users")
    res.render('sell',{
        allitems:items,
        organs:organs
    })
})
router.post('/add/sell',async(req,res)=>{
    const{debt,card,cash,transfer,minusCount,minusPayment,bazanarx,organid,curiername,summa,allid,customername,telnumber}=req.body;
    let insertfortranz=[]
    let inserttranzfororgan=[]
    order_id="id" + Math.random().toString(16).slice(2)
    debtor_id="id" + Math.random().toString(16).slice(2)
    inserttranzfororgan.push([1,summa,organid,order_id])
    for(let i=0;i<req.body.minusCount.length;i++){
        insertfortranz.push([allid[i],minusCount[i],1,order_id])
        if (debt>0){
            const data1=await RunSQL("INSERT INTO debtor(debtor_id,debtor_name,debtor_number)values(?,?,?)",[debtor_id,customername,telnumber])
            console.log(data1)
            await RunSQL("INSERT INTO debt(debtor_id,debt,debt_order_id,debt_descript)values(?,?,?,?)",[debtor_id,debt,order_id,""])
        
        }
    await RunSQL("INSERT INTO allsumma(cash,card,transfer,debt,order_id,user_id) Values(?,?,?,?,?,?)",[cash,card,transfer,debt,order_id,req.session.user_id])
    await RunSQL("INSERT INTO tranzactions(product_id,pr_count,price,sellprice,organ_id,order_id,customername,curiername) Values(?,?,?,?,?,?,?,?)",[allid[i],minusCount[i],bazanarx[i],minusPayment[i],organid,order_id,customername,curiername])
    await RunSQLOne("SELECT count(*)as cnt from filial_count where product_id=? and pr_user_id=?",[allid[i],1])
    await RunSQL("UPDATE filial_count SET  pr_count=pr_count-? WHERE product_id=? and pr_user_id=?",[minusCount[i],allid[i],req.session.user_id])
}

})

module.exports=router