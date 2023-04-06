router.get('/calcbyday',checker,async(req,res)=>{
    console.log(req.query)
      if ("date" in req.query){   
  
      const data=await RunSQLOne('SELECT sum(cash) as cash,sum(transfer) as transfer,sum(card) as card from allsumma  where DATE(cr_date)=? and user_id=? group by DATE(cr_date)',[req.query.date,req.session.user_id])
      res.render('paymentinfo',{
          data:data
      })
  }
      if ("month" in  req.query){
       
       const   data=await RunSQLOne("SELECT sum(cash) as cash,sum(transfer) as transfer,sum(card) as card from allsumma  where YEAR(cr_date)=? and MONTH(cr_date)=? and user_id=?",[parseInt(req.query.month.split('-')[0]),parseInt(req.query.month.split('-')[1]),req.session.user_id])
       console.log(data)
       res.render('paymentinfo',{
          data:data
      })    
      }
          if ("year" in req.query){
         const  data=await RunSQLOne('SELECT sum(cash) as cash,sum(transfer) as transfer,sum(card) as card from allsumma  where YEAR(cr_date)=? and user_id=? group by YEAR(cr_date)',[req.query.year,req.session.user_id])
          res.render('paymentinfo',{
              data:data
          })     
      }
              
     
  })
  module.exports=router;