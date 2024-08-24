import { useState,useEffect} from "react"
import {signInWithEmailAndPassword } from "firebase/auth";
import {auth} from '../firebase/firebase-auth'
import {Link} from "react-router-dom"
import axios from "axios"
import "./signin.css"

import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { useNavigate } from "react-router-dom";
import DotLoader from "react-spinners/DotLoader";
export function Login(){
    const nav=useNavigate();
const [email,setEmail]= useState("")
const [password,setPass]= useState("")
const [us, setUser]= useState<any>()
const [loading, setLoading]= useState<boolean>(false)
useEffect(() => {
  setLoading(true)
  const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

  ui.start('#firebaseui-auth-container', {
   
      callbacks: {
           signInSuccessWithAuthResult: function(authResult) {
            try{ 
              console.log(authResult)
               // Action if the user is authenticated successfully
              nav("/signup")}catch(e){
                console.log(e);
              }
           
               return false
               
           },
           signInFailure: function(error) {
            // For merge conflicts, the error.code will be
            // 'firebaseui/anonymous-upgrade-merge-conflict'.
            console.log("duhvu")

            if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
              console.log("duhvu")
              return Promise.resolve();
            }
            // The credential the user tried to sign in with.
         //   var cred = error.credential;
            // Copy data from anonymous user to permanent user and delete anonymous
            // user.
            // ...
            // Finish sign-in after data is copied.
            return 
          },
          uiShown: function() {
              // This is what should happen when the form is full loaded. In this example, I hide the loader element.
              document.getElementById('loader')!.style.display = 'none';
          }
      },
      signInSuccessUrl: 'https://google.com', // This is where should redirect if the sign in is successful.
      signInOptions: [ // This array contains all the ways an user can authenticate in your application. For this example, is only by email.
{
              provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            
             
          },{
              provider: firebase.auth.GithubAuthProvider.PROVIDER_ID,
             
          }
      ],
      tosUrl: 'https://www.example.com/terms-conditions', // URL to you terms and conditions.
      privacyPolicyUrl: function() { // URL to your privacy policy
          window.location.assign('https://www.example.com/privacy-policy');
      }
  });
  setLoading(false)
}, []);


    function signin (){
       
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            
            
           setUser(user)
           setLoading(false)
            nav("/dashboard")
           
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            setLoading(false)
          });
        
    }

    return(
      <div className=" flex flex-col justify-center items-center h-screen ">
        {loading?      <DotLoader
        color="blue"
        loading={loading}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
 :  
        <div className=" flex flex-col justify-center items-center h-screen w-screen">
         {/* <Navsign></Navsign> */}
         <div className="h-screen flex items-center mt-2 relative z-10 ">
          <div className="bg-blue-500 h-[500px] w-[430px] flex justify-center items-center flex-col">
            <h1 className="text-center text-white text-7xl font-lato my-16">C3</h1>
            <p className="text-md font-thin text-white font-lato m-3 text-center">This is the platform where one can convert their wisdom to worthy actions with implementing seamless collaborations to signify real team spirit.</p>
          </div>
         <div className="flex flex-col p-8 justify-center shadow-2xl rounded-lg h-[500px] w-[430px] bg-white">
           <div className="flex justify-center mt-2 my-2">
           <h1 className="text-3xl font-bold">Login</h1>
          
           </div>
          
           <div className="flex justify-center text-stone-500">
           <h1 className="text-sm font-semibold">Create an account?</h1>
           <Link to="/signup" className="text-sm font-semibold underline underline-offset-2	">Signup</Link>
          
           </div>
           <div>
           <p className="mt-1 text-md " >email</p>
         <input className="mt-1 rounded-lg border bg-stone-50 p-1 text-lg font-semibold w-full" type="email"  onChange={(e:any)=>{setEmail(e.target.value)}} placeholder="email"></input>
         </div>
         <div  className="mt-3">
           <p className="mt-1 text-md ">password</p>
         <input className="mt-1 rounded-lg border bg-stone-50 p-1 text-lg font-semibold w-full "    onChange={(e:any)=>{setPass(e.target.value)}} placeholder="password"></input>
         </div>
          <button className="my-5 rounded-md bg-blue-500 text-white h-10 text-2xl font-bold" onClick={async()=>{ setLoading(true);
          const response =await axios.post("http://localhost:3000/api/v1/signin",
                 {
                     email:email,
                     uid : password,
                 },{
                   withCredentials: true,
               })
               console.log(response.data)
           signin()
           console.log("j")
           localStorage.setItem("email",email);
           setLoading(false)
           nav("/dashboard")
           }}>signin</button>
          
              <div  className='flex flex-col items-center justify-center '>
                 <div id="firebaseui-auth-container"></div>
                 <div id="loader" className="text-center">Loading form</div>
                 {us}
             </div>
          </div>
          </div>
          </div>
          }
     
     </div>
    )

}