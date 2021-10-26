
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
require('dotenv').config()
const app={
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL:process.env.FIREBASE_PROJECT_ID,
    projectId:process.env.FIREBASE_STORAGE_BUCKET ,
    storageBucket:process.env.FIREBASE_MESSAGING_SENDER_ID ,
    appId:process.env.FIREBASE_APP_ID 
  }

initializeApp();
const db = getFirestore();

module.exports=db;

