const express = require('express');
const router=express.Router();
const db=require('../config');



router.get('/',(req,res)=>{
  res.send('Hello World');
});

router.post('/new',async(req,res)=>{

  const docRef = db.collection('users').doc('sarim');

await docRef.set({
  first: 'Ada',
  last: 'Lovelace',
  born: 1815}).then(()=>{
    res.send({'message':'added'});
  })
});
module.exports =router;