const express = require('express');
const router = express.Router();
const db = require('../config');
const {
	doc,
	setDoc,
	query,
	where,
	collection,
	getDocs
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
		name: req.body.name,
		email: req.body.email,
		gender: req.body.gender,
		isOrg: req.body.isOrg,
		tourlist: []
	};

	try {
		// const docRef = await addDoc(collection(db, "users"), {
		//   first: "Ada",
		//   last: "Lovelace",
		//   born: 1815
		// });
		// console.log("Document written with ID: ", docRef.id);

		const result = await setDoc(doc(db, 'users', req.body.email), obj).then(
			() => {
				res.send({ message: 'Added' });
			}
		);
	} catch (e) {
		console.error('Error adding document: ', e);
	}
});
module.exports = router;
