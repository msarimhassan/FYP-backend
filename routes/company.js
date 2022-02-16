const express=require('express');
const router=express.Router();
const db=require('../config');
const {doc,setDoc,query, where,collection,getDocs,getDoc,addDoc,deleteDoc}=require('firebase/firestore');



router.get("/",(req,res)=>{
    res.send("Hello from company");
})


// create company obj in users of app in firebase using post request

router.post("/new",async(req,res)=>{
    const obj={
        name:req.body.CompanyName,
        email:req.body.CompanyEmail,
        DtsNo:req.body.DtsNo,
        url:req.body.Url,
        instaUsername:req.body.InstaName,
        whatsappNo:req.body.WhatsappNo,
        isOrg:'Yes',
        tourlist:[]
    }
    console.log(obj);

    try {
          
         const result=await setDoc(doc(db, "users",req.body.CompanyEmail),obj).then(()=>{ res.send({'message':'Added'});})

    } catch (error) {
         console.error("Error adding document: ", error);
    }

     
});

//add tour to the array
// router.post('/addtour/:email',async(req,res)=>{
    
//     //get tourlist count;
//    let count=0;
//      const docid=req.params.email;
//      const usersRef = collection(db, "users");
//     const docref =doc(db, "users", docid);

//     try {
//         const q = query(usersRef, where("email","==",docid));
//         const queryResult = await getDocs(q);
//         queryResult.forEach(doc=>{
//            const{tourlist}=doc.data();
//             count=tourlist.length+1;
//            console.log('we are in count function',count);
//         })
//      } catch (error) {
//          console.log(error);
//          res.send(error);
//      }

//     const obj={
//         id:'Tourno'+count,
//         name:req.body.name,
//         class:req.body.class
//     }

//     await updateDoc(docref,{ tourlist:arrayUnion(obj)}).then(()=>{res.send("ADDED")})
// })


//get the tour count how many tours posted by the company 
router.get('/tourcount/:email',async(req,res)=>{
    let docID=req.params.email;
     const usersRef = collection(db, "users");
     try {
         
        const q = await query(usersRef, where("email","==",docID));
        const queryResult = await getDocs(q);
        queryResult.forEach(doc=>{
           const{tourlist}=doc.data();
           let count=tourlist.length;
           res.json({"count":count});
        })
     } catch (error) {
         console.log(error);
         res.send(error);
     }

})

//for getting the company all data including personal info and its tours data

router.get('/getcompanydata/:email',async(req,res)=>{
    let docID=req.params.email;  
    const usersRef = collection(db, "users");
    try {
        const q = await query(usersRef, where("email","==",docID));
        const queryResult = await getDocs(q);
         queryResult.forEach(doc=>{
           const document =doc.data();
           console.log(document);
           res.json(document);
        })
    
    } catch (error) {
        res.send(error);
    }


})



//add a tour in a new collection Tours

router.post('/addtour/:email',async(req,res)=>{
   
    const email=req.params.email;
    console.log(email);
    const obj = {
   email:req.params.email,
  title: req.body.title,
  location:req.body.location,
  imgUrl:req.body.imgUrl,
  duration:req.body.duration,
  price:req.body.price,
  date:req.body.date,
  details:req.body.details,
  
};

console.log(obj);
    try{
    const docRef = await addDoc(collection(db, "tours"), obj).then(()=>{ res.send({'message':'Added'});})
    }
    catch(error){
     console.log(error);
    }
})

//DELETE A TOUR FROM THE COLLECTION

router.delete('/deletetour/:id',async(req,res)=>{
    
    const id=req.params.id
    await deleteDoc(doc(db, "tours",id)).then(()=>{res.send({'message':'DELETED'})})
})

//Get tours of specified company and apply crud opearation;

router.get('/gettours/:email',async(req,res)=>{
 

     let array=[];

    const q = query(collection(db, "tours"), where("email", "==", req.params.email));

      const querySnapshot = await getDocs(q);
     querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
  let obj={id:doc.id,...doc.data()};
  array.push(obj);
});
res.send(array);
})

//get only one tour to view its data and then update

router.get('/gettour/:id',async(req,res)=>{
        
    const id=req.params.id;
    const docRef = doc(db, "tours", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
     const tour=docSnap.data();
     res.send(tour);
} else {
  console.log("No such document!");
}


})

module.exports=router;


