// FirebaseUI

import 'firebaseui/dist/firebaseui.css'
import {  createUserWithEmailAndPassword } from "firebase/auth";

// React stuff
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from 'recoil'; 
// Auth service
import {auth} from '../firebase/firebase-auth'
import { Navsign } from '../components/navbar.sign';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios"
import { DotLoader } from 'react-spinners';
import {user} from "../components/user.account"
export default () => {
    const [email, setEmail]= useState("")
const [password, setPassword]= useState("")
const [loading, setLoading]= useState<boolean>(false)
const setUser=useSetRecoilState(user);
const nav= useNavigate()
 
    async function signup(){
     
         (createUserWithEmailAndPassword(auth, email, password)
         

         .then((userCredential) => {
           // Signed up 
           const user = userCredential.user;
           console.log(user.providerData[0].email)
           console.log(userCredential.user.providerId)
           nav("/dashboard");
           // ...
         })
         .catch((error) => {
           const errorCode = error.code;
           const errorMessage = error.message;
           console.log(errorCode+errorMessage);
           // ..
         })
        )
        }


    return (
        <div className=" flex flex-col justify-center items-center h-screen">
          {loading?<DotLoader
           color="red"
           loading={loading}
           size={40}
           aria-label="Loading Spinner"
           data-testid="loader"
          
          /> :
          <div className=" flex flex-col justify-center items-center h-screen w-screen">
          <Navsign></Navsign>
          <div className="h-screen flex items-center mt-2">
        
          <div className="flex flex-col p-8   justify-center shadow-2xl rounded-lg">
            <div className="flex justify-center mt-2 my-2">
            <h1 className="text-3xl font-bold">Signup</h1>
           
            </div>
      
            <div className="flex justify-center text-stone-500">
            <h1 className="text-sm font-semibold">Already have an account?</h1>
            <Link to="/login" className="text-sm font-semibold underline underline-offset-2	">Login</Link>
           
            </div>
            <div>
            <p className="mt-1 text-md " >email</p>
          <input className="mt-1 rounded-lg border bg-stone-50 p-1 text-lg font-semibold w-full"   onChange={(e:any)=>{setEmail(e.target.value)}} placeholder="email"></input>
          </div>
          <div  className="mt-3">
            <p className="mt-1 text-md ">password</p>
          <input className="mt-1 rounded-lg border bg-stone-50 p-1 text-lg font-semibold w-full "    onChange={(e:any)=>{setPassword(e.target.value)}} placeholder="password"></input>
          </div>
           <button className="my-5 rounded-lg bg-red-500 text-white h-10 text-2xl font-bold" onClick={
            
            async()=>{

              setLoading(true);
              const response=await axios.post("https://docs-clone-c3.onrender.com/api/v1/signup",
                  {
                      email: email,
                      uid : password,
                  }, {
                    withCredentials: true,
                })
                    console.log(response)
                   setUser(email);
                   localStorage.setItem("email",email);
                   signup();
          setLoading(false);
          }
            
            }>signup</button>
           
             
           </div>
           </div>
           </div>
           }
         
   </div>
       
       
    )
}