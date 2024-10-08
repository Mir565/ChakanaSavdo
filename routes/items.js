const { checkerAdmin } = require("../middleware/checkerforadmin");

router.get('/add/item', checker, async (req, res) => {
    const items = await RunSQL("SELECT * from Products pr  join filial_count fc on pr.product_id=fc.product_id  where fc.user_id=? limit 0",[req.session.user_id]);
    const organs = await RunSQL("SELECT * from organizations")
    res.render('updateproduct', {
        allitems: items,
        organs: organs
    })
})
router.post('/add/item',checker, async(req, res) => {
    const {kurs,allid, minusName, minusCount, minusPayment, bazanarx, barkod, idfornews, organid, curiername, summa } = req.body;
 
    let inserting = []
    let updating = []
    let insertfortranz = []
    let inserttranzfororgan = []
    order_id = "id" + Math.random().toString(16).slice(2)
    inserttranzfororgan.push([curiername, summa, organid, order_id])
    for (let i = 0; i < req.body.minusName.length; i++){
        insertfortranz.push([minusCount[i], bazanarx[i], parseInt(organid), order_id])
        if (idfornews[i])   
        {
            inserting.push([minusName[i], barkod[i],1,bazanarx[i], minusPayment[i],kurs[i]])
        }
        else{
            await RunSQL("UPDATE products SET  price=?,sell_price=?,ISSUM=?  WHERE product_id=?", [bazanarx[i], minusPayment[i], kurs[i],allid[i]])
            await RunSQL("UPDATE filial_count SET  pr_count=pr_count+? WHERE product_id=? and pr_user_id=?", [minusCount[i],allid[i],req.session.user_id])
        }
        }
        const datalog=await RunSQL("INSERT INTO products(name, barcode,category_id,price,sell_price,ISSUM) VALUES ?", [inserting])
        for (let i = 0; i < minusCount.length; i++) {
        let { product_id } = await RunSQLOne("SELECT product_id from products where barcode=?", [barkod[i]])
        if (idfornews[i])
            {
               
                const data1=await RunSQL("INSERT INTO filial_count(product_id,pr_count,pr_user_id) VALUES (?,?,?)", [product_id,minusCount[i],req.session.user_id])  
         
            }
        insertfortranz[i].push(product_id)
    }
    const insertingfortranz = await RunSQL("INSERT INTO organtranzactions(pr_count,price,organ_id,order_id,product_id) VALUES ?", [insertfortranz])
    const insertfortranzall = await RunSQL("INSERT INTO tranzbyorderid(organ_name,summa,organ_id,order_id) VALUES ?", [inserttranzfororgan])

    res.json([]);
})
router.get('/search/item',checker, async (req, res) => {
    const item = await RunSQLOne("Select * from products pr join filial_count fc on fc.product_id=pr.product_id  where barcode=? and fc.pr_user_id=?", [req.query.barcode,req.session.user_id])
    if (item) {
        res.json(item);
    } else {
        res.json({})
    }
})
router.get('/search/itemText',checker, async (req, res) => {
    const item = await RunSQL("Select * from products pr join filial_count fc on fc.product_id=pr.product_id  where fc.pr_user_id=? and  name like ? limit 20", [req.session.user_id,"%" + req.query.name + "%"])
    if (item) {
        res.json(item);
    } else {
        res.json({})
    }
})
router.get('/search/itemor', async (req, res) => {
    const item = await RunSQL("Select * from products pr join filial_count fc on fc.product_id=pr.product_id where fc.pr_user_id=? and (barcode like ? or name like ?)limit 100", [req.session.user_id,"%" + req.query.barcode + "%", "%" + req.query.barcode + "%"])
    if (item) {
        res.json(item);
    } else {
        res.json({})
    }
})
router.get('/get/barkod',checker, async (req, res) => {
    res.render('barkod', {
        barkod: req.query.barkod,
        name: req.query.name,
        price: req.query.price
    })
})
router.get('/update/item', checker,async (req, res) => {
    const data = await RunSQL("SELECT * FROM  products pr join filial_count fc on pr.product_id=fc.product_id where fc.pr_user_id=? and fc.product_id=?", [req.session.user_id,req.query.id])
   
    res.render('updateitem', {
        data: data
    })
})
router.post('/update/item', checker,async (req, res) => {
    
    const { name, price, sell_price, barkod, pr_count,kurs} = req.body;
    console.log(kurs)
    const data = await RunSQL('UPDATE products set name=?,price=?,sell_price=?,barcode=?,ISSUM=? where product_id=?', [name, price, sell_price, barkod,kurs, req.query.id])
    await  RunSQL('UPDATE filial_count set pr_count=? where product_id=? and pr_user_id=?', [pr_count,req.query.id,req.session.user_id])
    res.redirect(`/get/items?getpage=1`)
})

router.get('/get/items', checker,async (req, res) => {
    
    const items = await RunSQL('Select * from  products pr join filial_count fc on pr.product_id=fc.product_id  where fc.pr_user_id=? limit ? offset ?', [req.session.user_id,100, (parseInt(req.query.getpage) - 1) * 100]);
    const count = await RunSQLOne('Select count(*) as cnt from products pr join filial_count fc on pr.product_id=fc.product_id where fc.pr_user_id=?',[req.session.user_id]);

    const{kurs}=await RunSQLOne("select kurs from valuta");
    res.render('allitems', {
        items: items,
        count: count.cnt,
        kurs:kurs
    })
})
router.get('/sold/items',checker, async (req, res) => {
    let alltranz,count;
   
    if (req.query.name){

     alltranz = await RunSQL("SELECT tranzactions.cr_date,pr.name,tranzactions.product_id,sum(tranzactions.pr_count) as pr_count from tranzactions  join products pr on pr.product_id=tranzactions.product_id where DATE(tranzactions.cr_date)=? and pr.name like ?  group by tranzactions.product_id  limit 100 offset ?", [req.query.date,"%"+req.query.name+"%",(parseInt(req.query.getpage) - 1) * 100])
    }
    else if (req.query.barkod){
        alltranz = await RunSQL("SELECT tranzactions.cr_date,pr.name,tranzactions.product_id,sum(tranzactions.pr_count) as pr_count from tranzactions  join products pr on pr.product_id=tranzactions.product_id where DATE(tranzactions.cr_date)=? and pr.barcode=?  group by tranzactions.product_id  limit 100 offset ?", [req.query.date,req.query.barkod,(parseInt(req.query.getpage) - 1) * 100])
    }
    else{
        alltranz = await RunSQL("SELECT tranzactions.cr_date,pr.name,tranzactions.product_id,sum(tranzactions.pr_count) as pr_count from tranzactions  join products pr on pr.product_id=tranzactions.product_id where DATE(tranzactions.cr_date)=?   group by tranzactions.product_id  limit 100 offset ?", [req.query.date,(parseInt(req.query.getpage) - 1) * 100])  
    
    }
    count = await RunSQLOne("select count(*) as cnt from (SELECT * from tranzactions  where DATE(tranzactions.cr_date)=?   group by tranzactions.product_id) as result;", [req.query.date])
    if (count==undefined){
        res.render('solditems',{
            alltranz:alltranz,
            count:0
        })
    }else{
    res.render('solditems',{
        alltranz:alltranz,
        count:count.cnt
    })
}
})
router.get('/sold/itemsinfo',checker,async(req,res)=>{
    const alltranz=await RunSQL("select * from tranzactions join products on products.product_id=tranzactions.product_id where (DATE(tranzactions.cr_date)=?) and  tranzactions.product_id=? limit 100 offset ?",[req.query.date,req.query.product_id,(parseInt(req.query.getpage)-1)*100])
    const count=await RunSQLOne('select count(*) as cnt from tranzactions join products on products.product_id=tranzactions.product_id where (DATE(tranzactions.cr_date)=?) and  tranzactions.product_id=?',[req.query.date,req.query.product_id])
    const{kurs}=await RunSQLOne("select kurs from valuta");
    res.render('solditemsinfo',{
        alltranz:alltranz,
        count:count.cnt,
        kurs:kurs
    })
})

module.exports = router;