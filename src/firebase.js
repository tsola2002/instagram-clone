// THIS FILE IS RESPONSIBLE FOR OUR CONFIG SETTINGS
import firebase from "firebase";

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDhllPENpisRjXT8kpEuG4e7t0CDE2poG8",
    authDomain: "instagram-clone-bb118.firebaseapp.com",
    databaseURL: "https://instagram-clone-bb118.firebaseio.com",
    projectId: "instagram-clone-bb118",
    storageBucket: "instagram-clone-bb118.appspot.com",
    messagingSenderId: "1097926987747",
    appId: "1:1097926987747:web:49bfbb97aa42f47ca0dad6"  
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export { db, auth, storage };