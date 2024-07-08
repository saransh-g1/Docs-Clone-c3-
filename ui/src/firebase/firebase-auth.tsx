import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import * as firebaseui from "firebaseui"
    // Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries



const firebaseConfig = {
  apiKey: "AIzaSyCzStJzErfDxFod8rKLZ_B52eJcU_-bdRM",
  authDomain: "editor-3afb7.firebaseapp.com",
  projectId: "editor-3afb7",
  storageBucket: "editor-3afb7.appspot.com",
  messagingSenderId: "705136662346",
  appId: "1:705136662346:web:c74c07eab62c82b94593b3",
  measurementId: "G-D1DDM6EF46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth=getAuth(app)

let ui=
firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

export function getUiInstance(){
return ui;    
}

export {app,auth}
