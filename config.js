
// const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
// const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
// const serviceAccount = require('./trekxplorer-key.json');
const { initializeApp } =require("firebase/app");
const { getFirestore } = require("firebase/firestore");
require('dotenv').config()


const firebaseapp=initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
});

var db = getFirestore();

module.exports=db;
