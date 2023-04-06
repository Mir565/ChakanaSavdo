router.get("/all/magtranzactions", async (req, res) => {
  await RunSQL("SET sql_mode = ''");
  const alltranz = await RunSQL(
    "SELECT users.email,mag.cr_date,mag.order_id from magazinstranz as mag join users   on users.user_id=mag.user_id where mag.cr_date>=? and mag.user_id=?  group by(mag.order_id)  order by mag.cr_date desc limit ? offset ?",
    [
      req.query.date,
      req.query.name,
      100,
      (parseInt(req.query.getpage) - 1) * 100,
    ]
  );
  const count = await RunSQLOne("SELECT count(*) as cnt FROM magazinstranz ");
  const organs = await RunSQL("SELECT * from users");
  res.render("alltranzmag", {
    alltranz: alltranz,
    count: count.cnt,
    organs: organs,
  });
});
router.get("/update/magtranzactioninfo", async (req, res) => {
    const{count,mag_tranz_id,prev_count,user_id,product_id}=req.query;
    await RunSQL("UPDATE magazinstranz SET pr_count=? where mag_tranz_id=?",[count,mag_tranz_id])
    await RunSQL("UPDATE filial_count SET pr_count=pr_count+? where pr_user_id=? and product_id=?",[count-prev_count,user_id,product_id])
    await RunSQL("UPDATE filial_count SET pr_count=pr_count-? where pr_user_id=? and product_id=?",[count-prev_count,req.session.user_id,product_id])
   
    res.json({msg:"success"})
});
router.get("/get/magtranzactioninfo", async (req, res) => {
  const alltranzinfo = await RunSQL(
    "SELECT *,tr.pr_count FROM  magazinstranz tr join products  as pd on pd.product_id=tr.product_id  where order_id=? limit ? offset ?",
    [req.query.order_id, 100, (parseInt(req.query.getpage) - 1) * 100]
  );
  const count = await RunSQLOne(
    "SELECT count(*) as cnt FROM  magazinstranz tr where order_id=?",
    [req.query.order_id]
  );
  console.log(alltranzinfo);
  res.render("alltranzinfomag", {
    alltranzinfo: alltranzinfo,
    count: count.cnt,
  });
});
module.exports = router;
