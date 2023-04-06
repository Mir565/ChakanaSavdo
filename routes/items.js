const { checkerAdmin } = require("../middleware/checkerforadmin");

router.get('/add/item', checker, async (req, res) => {
    const items = await RunSQL("SELECT * from Products pr  join filial_count fc on pr.product_id=fc.product_id  where fc.user_id=? limit 0",[req.session.user_id]);
    const organs = await RunSQL("SELECT * from organizations")
    res.render('updateproduct', {
        allitems: items,
        organs: organs
    })
})
router.post('/add/item', async(req, res) => {
    const {allid, minusName, minusCount, minusPayment, bazanarx, barkod, idfornews, organid, curiername, summa } = req.body;
    console.log(allid)
    let inserting = []
    let updating = []
    let insertfortranz = []
    let inserttranzfororgan = []
    order_id = "id" + Math.random().toString(16).slice(2)
    inserttranzfororgan.push([curiername, summa, organid, order_id])
    for (let i = 0; i < req.body.minusName.length; i++) {
        insertfortranz.push([minusCount[i], bazanarx[i], parseInt(organid), order_id])
        if (idfornews[i])
            
        {
            inserting.push([minusName[i], barkod[i],1,bazanarx[i], minusPayment[i]])
        }
        else{
            await RunSQL("UPDATE products SET  price=?,sell_price=? WHERE product_id=?", [bazanarx[i], minusPayment[i], allid[i]])
            await RunSQL("UPDATE filial_count SET  pr_count=pr_count+? WHERE product_id=? and pr_user_id=?", [minusCount[i],allid[i],req.session.user_id])
        }
        }
        await RunSQL("INSERT INTO products(name, barcode,category_id,price,sell_price) VALUES ?", [inserting])
        for (let i = 0; i < minusCount.length; i++) {
        let { product_id } = await RunSQLOne("SELECT product_id from products where barcode=?", [barkod[i]])
        if (idfornews[i])
            {
                console.log('entered')
                console.log(req.session.user_id)
                const data1=await RunSQL("INSERT INTO filial_count(product_id,pr_count,pr_user_id) VALUES (?,?,?)", [product_id,minusCount[i],req.session.user_id])  
           console.log(data1)
            }
        insertfortranz[i].push(product_id)
    }
    const insertingfortranz = await RunSQL("INSERT INTO tranzactions(pr_count,price,organ_id,order_id,product_id) VALUES ?", [insertfortranz])
    const insertfortranzall = await RunSQL("INSERT INTO tranzbyorderid(organ_name,summa,organ_id,order_id) VALUES ?", [inserttranzfororgan])
    console.log(insertfortranzall)
    res.json([]);
})
router.get('/search/item', async (req, res) => {
    const item = await RunSQLOne("Select * from products pr join filial_count fc on fc.product_id=pr.product_id  where barcode=? and fc.pr_user_id=?", [req.query.barcode,req.session.user_id])
    if (item) {
        res.json(item);
    } else {
        res.json({})
    }
})
router.get('/search/itemText', async (req, res) => {
    const item = await RunSQL("Select * from products pr join filial_count fc on fc.product_id=pr.product_id  where fc.user_id=? and  name like ? limit 20", [req.session.user_id,"%" + req.query.name + "%"])
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
router.get('/get/barkod', async (req, res) => {
    res.render('barkod', {
        barkod: req.query.barkod,
        name: req.query.name,
        price: req.query.price
    })
})
router.get('/update/item', checkerAdmin,async (req, res) => {
    const data = await RunSQL("SELECT * FROM  products pr join filial_count fc on pr.product_id=fc.product_id where fc.pr_user_id=? and fc.product_id=?", [req.session.user_id,req.query.id])
    console.log(data)
    res.render('updateitem', {
        data: data
    })
})
router.post('/update/item', checkerAdmin,async (req, res) => {
    console.log(req.body)
    const { name, price, sell_price, barkod, pr_count } = req.body;
    const data = await RunSQL('UPDATE products set name=?,price=?,sell_price=?,barcode=? where product_id=?', [name, price, sell_price, barkod, req.query.id])
    await  RunSQL('UPDATE filial_count set pr_count=? where product_id=? and pr_user_id=?', [pr_count,req.query.id,req.session.user_id])
    res.redirect(`/get/items?getpage=1`)
})

router.get('/get/items', checker,async (req, res) => {
    console.log(req.session.user_id)
    const items = await RunSQL('Select * from  products pr join filial_count fc on pr.product_id=fc.product_id  where fc.pr_user_id=? limit ? offset ?', [req.session.user_id,100, (parseInt(req.query.getpage) - 1) * 100]);
    const count = await RunSQLOne('Select count(*) as cnt from products pr join filial_count fc on pr.product_id=fc.product_id where fc.pr_user_id=?',[req.session.user_id]);
    console.log(items)
    res.render('allitems', {
        items: items,
        count: count.cnt
    })
})
router.get('/sold/items',checker, async (req, res) => {
    const alltranz = await RunSQL("SELECT tranzfilial.cr_date,pr.name,tranzfilial.product_id,sum(tranzfilial.pr_count) as pr_count from tranzfilial  join products pr on pr.product_id=tranzfilial.product_id where (DATE(tranzfilial.cr_date)=? and tranzfilial.magid=?)   group by tranzfilial.product_id  limit 100 offset ?", [req.query.date,req.session.user_id,(parseInt(req.query.getpage) - 1) * 100])
    console.log(alltranz,req.session.user_id)
    const count = await RunSQLOne("SELECT count(*) as cnt from tranzfilial  join products pr on pr.product_id=tranzfilial.product_id where DATE(tranzfilial.cr_date)=? and tranzfilial.magid=?   group by tranzfilial.product_id", [req.query.date,req.session.user_id])
    
    console.log(count)
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
router.get('/sold/itemsinfo',async(req,res)=>{
    const alltranz=await RunSQL("SELECT mag.*,users.email,pr.name FROM tranzfilial mag join users on users.user_id=mag.magid join products pr on pr.product_id=mag.product_id  where mag.product_id=? and DATE(mag.cr_date)=? and mag.magid=? limit 100 offset ?",[req.query.product_id,req.query.date,req.session.user_id,(parseInt(req.query.getpage)-1)*100])
    const count=await RunSQLOne('SELECT count(*) as cnt FROM tranzfilial mag join users on users.user_id=mag.magid join products pr on pr.product_id=mag.product_id  where mag.product_id=? and DATE(mag.cr_date)=? and mag.magid=?',[req.query.product_id,req.query.date,req.session.user_id])
    console.log(count)
    res.render('solditemsinfo',{
        alltranz:alltranz,
        count:count.cnt
    })
})

module.exports = router;