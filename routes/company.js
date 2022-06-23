const express = require('express');
const router = express.Router();
const db = require('../config');
const {
	getStorage,
	ref,
	deleteObject,
	refFromURL
} = require('firebase/storage');
const storage = getStorage();
const {
	doc,
	setDoc,
	query,
	where,
	collection,
	getDocs,
	getDoc,
	addDoc,
	deleteDoc,
	updateDoc
} = require('firebase/firestore');

router.get('/', (req, res) => {
	res.send('Hello from company');
});

// create company obj in users of app in firebase using post request

router.post('/new', async (req, res) => {
	const obj = {
		name: req.body.CompanyName,
		email: req.body.CompanyEmail,
		DtsNo: req.body.DtsNo,
		url: req.body.Url,
		instaUsername: req.body.InstaName,
		whatsappNo: req.body.WhatsappNo,
		isOrg: 'Yes',
		tourlist: []
	};
	console.log(obj);

	try {
		const result = await setDoc(
			doc(db, 'users', req.body.CompanyEmail),
			obj
		).then(() => {
			res.send({ message: 'Added' });
		});
	} catch (error) {
		console.error('Error adding document: ', error);
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
router.get('/tourcount/:email', async (req, res) => {
	let count = 0;
	let docID = req.params.email;
	const usersRef = collection(db, 'tours');
	try {
		const q = await query(usersRef, where('email', '==', docID));
		const queryResult = await getDocs(q);
		queryResult.forEach(doc => {
			count++;
		});
		res.send({ count: count });
	} catch (error) {
		console.log(error);

		res.send(error);
	}
});

//for getting the company all data including personal info and its tours data

router.get('/getcompanydata/:email', async (req, res) => {
	let docID = req.params.email;
	const usersRef = collection(db, 'users');
	try {
		const q = await query(usersRef, where('email', '==', docID));
		const queryResult = await getDocs(q);
		queryResult.forEach(doc => {
			const document = doc.data();
			console.log(document);
			res.json(document);
		});
	} catch (error) {
		res.send(error);
	}
});

//add a tour in a new collection Tours

router.post('/addtour/:email', async (req, res) => {
	console.log('Request.body', req.body);
	const email = req.params.email;
	console.log(email);
	const obj = {
		email: req.params.email,
		title: req.body.title,
		location: req.body.location,
		imgUrl: req.body.imgUrl,
		duration: req.body.duration,
		price: req.body.price,
		date: req.body.date,
		details: req.body.details,
		instaUsername: req.body.instaUsername,
		whatsappNo: req.body.whatsappNo,
		url: req.body.webUrl,
		companyName: req.body.CompanyName,
		email: req.params.email
	};

	// const a = {
	// 	email: req.params.email, ...req.body
	// }

	console.log('backend tour', obj);
	try {
		const docRef = await addDoc(collection(db, 'tours'), obj).then(() => {
			res.send({ message: 'Added' });
		});
	} catch (error) {
		console.log(error);
	}
});

//DELETE A TOUR FROM THE COLLECTION

router.delete('/deletetour/:id', async (req, res) => {
	const id = req.params.id;
	await deleteDoc(doc(db, 'tours', id)).then(() => {
		res.send({ message: 'DELETED' });
	});
});

//Get tours of specified company and apply crud opearation;

router.get('/gettours/:email', async (req, res) => {
	let array = [];

	const q = query(
		collection(db, 'tours'),
		where('email', '==', req.params.email)
	);

	const querySnapshot = await getDocs(q);
	querySnapshot.forEach(doc => {
		// doc.data() is never undefined for query doc snapshots
		console.log(doc.id, ' => ', doc.data());
		let obj = { id: doc.id, ...doc.data() };
		array.push(obj);
	});
	res.send(array);
});

//get only one tour to view its data and then update

router.get('/gettour/:id', async (req, res) => {
	const id = req.params.id;
	const docRef = doc(db, 'tours', id);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		const tour = docSnap.data();
		res.send(tour);
	} else {
		console.log('No such document!');
	}
});

// Update tour of the company

router.put('/updateTour', async (req, res) => {
	const tourRef = doc(db, 'tours', req.body.id);
	await updateDoc(tourRef, {
		date: req.body.date,
		details: req.body.details,
		duration: req.body.duration,
		imgUrl: req.body.imgUrl,
		location: req.body.location,
		price: req.body.price,
		title: req.body.title
	})
		.then(Res => {
			res.send('Updated');
		})
		.catch(err => {
			console.log(err);
		});
});

//update insta
router.put('/updatecompanyinsta/:email', async (req, res) => {
	const companyRef = doc(db, 'users', req.params.email);
	await updateDoc(companyRef, {
		instaUsername: req.body.insta
	})
		.then(Res => {
			res.send('updated insta');
		})
		.catch(err => {
			console.log(err);
		});
});

//update whatsapp
router.put('/updatecompanywhatsapp/:email', async (req, res) => {
	const companyRef = doc(db, 'users', req.params.email);
	await updateDoc(companyRef, {
		whatsappNo: req.body.whatsapp
	})
		.then(Res => {
			res.send('updated whatsapp');
		})
		.catch(err => {
			console.log(err);
		});
});

//update webiste link
router.put('/updatecompanywebsite/:email', async (req, res) => {
	const companyRef = doc(db, 'users', req.params.email);
	await updateDoc(companyRef, {
		url: req.body.url
	})
		.then(Res => {
			res.send('updated website url');
		})
		.catch(err => {
			console.log(err);
		});
});
router.get('/countlikes/:name', async (req, res) => {
	let liked = 0;
	let name = req.params.name;
	const usersRef = collection(db, 'favourites');
	try {
		const q = query(usersRef, where('companyName', '==', name));
		const queryResult = await getDocs(q);
		queryResult.forEach(doc => {
			liked++;
		});
		res.send({ likes: liked });
	} catch (error) {
		console.log(error);
		res.send(error);
	}
});

router.get('/getfeedback/:name',async(req,res)=>{

	let feedback=[];
	let name = req.params.name;
	const usersRef = collection(db, 'feedbacks');
try {
	const q = query(usersRef, where('companyName', '==', name));
	const queryResult = await getDocs(q);
	queryResult.forEach(doc => {
		feedback.push(doc.data());
	});
	res.send({ feedbacks: feedback });
} catch (error) {
	console.log(error);
	res.send(error);
}
})
module.exports = router;
