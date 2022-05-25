const express = require('express');
const router = express.Router();
const db = require('../config');
const {
	doc,
	setDoc,
	query,
	where,
	collection,
	getDocs,
	deleteDoc,
	updateDoc
} = require('firebase/firestore');

router.get('/', (req, res) => {
	res.send('Hello World');
});
// return YES OR NO whether it is a company or not
router.get('/findbyemail/:email', async (req, res) => {
	let email = req.params.email;
	const usersRef = collection(db, 'users');
	try {
		const q = await query(usersRef, where('email', '==', email));
		const queryResult = await getDocs(q);

		queryResult.forEach(doc => {
			const { isOrg } = doc.data();
			res.json({ isOrg: isOrg });
		});
	} catch (error) {
		res.send(error);
	}
});
// create a user in the firebase
router.post('/new', async (req, res) => {
	const obj = {
		name: req.body.Name,
		email: req.body.Email,
		gender: req.body.Gender,
		isOrg: 'No',
		tourlist: []
	};

	try {
		setDoc(doc(db, 'users', req.body.Email), obj).then(() => {
			res.send({ message: 'Added' });
		});
	} catch (e) {
		console.error('Error adding document: ', e);
	}
});
//getting user data
router.get('/getuserdata/:email', async (req, res) => {
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

//getting all tours of all companies
router.get('/getalltours', async (req, res) => {
	let array = [];
	const querySnapshot = await getDocs(collection(db, 'tours'));
	querySnapshot.forEach(doc => {
		// doc.data() is never undefined for query doc snapshots
		const obj = { id: doc.id, ...doc.data() };
		array.push(obj);
	});
	res.send(array);
});

//Add to Favourite
router.post('/addfavourite', async (req, res) => {
	const obj = {
		title: req.body.title,
		location: req.body.location,
		imgUrl: req.body.imgUrl,
		duration: req.body.duration,
		price: req.body.price,
		date: req.body.date,
		details: req.body.details,
		instaUsername: req.body.instaUsername,
		whatsappNo: req.body.whatsappNo,
		url: req.body.url,
		companyName: req.body.companyName,
		email: req.body.useremail,
		id: req.body.id
	};
	try {
		setDoc(doc(db, 'favourites', req.body.id), obj).then(() => {
			res.send({ message: 'Added' });
		});
	} catch (e) {
		console.error('Error adding document: ', e);
	}
});

//  get all favourites tour
router.get('/getfavourite/:email', async (req, res) => {
	let userEmail = req.params.email;
	const array = [];
	const usersRef = collection(db, 'favourites');
	try {
		const q = await query(usersRef, where('email', '==', userEmail));
		const queryResult = await getDocs(q);
		queryResult.forEach(doc => {
			array.push(doc.data());
		});
		res.send(array);
	} catch (error) {
		console.log(error);

		res.send(error);
	}
});

router.delete('/deletefavourite/:id', async (req, res) => {
	const id = req.params.id;
	await deleteDoc(doc(db, 'favourites', id)).then(() => {
		res.send({ message: 'DELETED' });
	});
});

router.put('/updatename/:email', async (req, res) => {
	const userRef = doc(db, 'users', req.params.email);
	await updateDoc(userRef, {
		name: req.body.name
	})
		.then(Res => {
			res.send('updated website url');
		})
		.catch(err => {
			console.log(err);
		});
});

module.exports = router;
