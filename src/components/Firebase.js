// firebaseInit.js
import firebase from "firebase";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBxDZrBYylj49rtuicJzb0vyGKAY1OsJ4M",
    authDomain: "bizdem-c4931.firebaseapp.com",
    projectId: "bizdem-c4931",
    storageBucket: "bizdem-c4931.appspot.com",
    messagingSenderId: "1005431520403",
    appId: "1:1005431520403:web:489f6a81f27cbbd6396166",
    measurementId: "G-V6HPXX5T9X"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const storageRef = firebase.storage().ref();