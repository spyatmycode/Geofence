// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth'
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
/* const firebaseConfig = {
  apiKey: "AIzaSyAsJchA4hI5BYn-S_5-MGNBuj-AAfsIzMo",
  authDomain: "geosafe-6b8b1.firebaseapp.com",
  projectId: "geosafe-6b8b1",
  storageBucket: "geosafe-6b8b1.appspot.com",
  messagingSenderId: "761911081091",
  appId: "1:761911081091:web:961cc45b722d154c3183b6",
  measurementId: "G-YL1FSF66B1"
}; */

const firebaseConfig = {
  apiKey: "AIzaSyAC4XrPKPfpA1Co9MgjrY-t_Su9YUwvYf4",
  authDomain: "fypr-e59fc.firebaseapp.com",
  projectId: "fypr-e59fc",
  storageBucket: "fypr-e59fc.appspot.com",
  messagingSenderId: "353943976239",
  appId: "1:353943976239:web:15dce2578f8cee3b1dc9da",
  measurementId: "G-BRDNSRBZ1P",
  databaseURL: "https://fypr-e59fc-default-rtdb.firebaseio.com",

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const database = getDatabase(app)
const analytics = getAnalytics(app);