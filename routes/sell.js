
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
    console.log(req.body)
    console.log(req.session.user_id)
    const{minusName,minusCount,minusPayment,bazanarx,barkod,idfornews,organid,curiername,summa,allid,customername}=req.body;
    let insertfortranz=[]
    let inserttranzfororgan=[]
    let insertfortranzact=[]
    order_id="id" + Math.random().toString(16).slice(2)
    inserttranzfororgan.push([1,summa,organid,order_id])
    for(let i=0;i<req.body.minusName.length;i++){
        insertfortranz.push([allid[i],minusCount[i],1,order_id])
        insertfortranzact.push([])
        //if(idfornews[i])
        //inserting.push([minusName[i],barkod[i],minusCount[i],1,1,bazanarx[i],minusPayment[i]])
        //else
        //await RunSQL("UPDATE products SET  pr_count=pr_count+?,price=?,sell_price=? WHERE barcode=?",[minusCount[i],bazanarx[i],minusPayment[i],barkod[i]])
        await RunSQL("INSERT INTO tranzactions(prdocut_id,pr_count,price,sellprice,organid,order_id,customername,curiername",[allid[i],minusCount[i],bazanarx[i],minusPayment[i],organid,order_id,customername,curiername])
        const data=await RunSQLOne("SELECT count(*)as cnt from filial_count where product_id=? and pr_user_id=?",[allid[i],1])
    console.log(data.cnt)
    if (data.cnt){
            await RunSQL("UPDATE filial_count SET  pr_count=pr_count+? WHERE product_id=? and pr_user_id=?",[minusCount[i],allid[i],1])
        } 
    else{
    await RunSQL("INSERT INTO filial_count(pr_count,product_id,pr_user_id) VALUES (?,?,?)",[minusCount[i],parseInt(allid[i]),1])
    }
    const data1=await RunSQL("UPDATE filial_count SET  pr_count=pr_count-? WHERE product_id=? and pr_user_id=?",[minusCount[i],allid[i],req.session.user_id])
   console.log(data1)

}
    const insertingitem=await RunSQL("INSERT INTO magazinstranz(product_id,pr_count,user_id,order_id) VALUES ?",[insertfortranz])
    // const insertfortranzall=await RunSQL("INSERT INTO tranzbyorderid(organ_name,summa,organ_id,order_id) VALUES ?",[inserttranzfororgan])
    //console.log(insertfortranzall)
    //res.json(insertingitem);
})

module.exports=router