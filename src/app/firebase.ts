// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCIAucQgArBkR5qWwi8nI_G4fFHlGY2oFg",
    authDomain: "pantry-tracker-57d8c.firebaseapp.com",
    projectId: "pantry-tracker-57d8c",
    storageBucket: "pantry-tracker-57d8c.appspot.com",
    messagingSenderId: "928723966109",
    appId: "1:928723966109:web:2923b7530582d57c315c74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)