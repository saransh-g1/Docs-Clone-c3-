import { SiGoogledocs } from "react-icons/si";
import { useNavigate } from "react-router-dom";

export function Navsign(){
    const nav= useNavigate()
    return(
        <div className=" h-14 font-lato w-full flex justify-between items-center shadow-xl px-5 bg-black text-white" >
            <div className="flex justify-between items-center">
        <SiGoogledocs color="rgb(66, 133, 244)" size={38}/>
        <p className="text-2xl font-extrabold mx-2 ">C3</p>
        </div>
       <div className="flex text-3xl font-extrabold font-play" >
        <p className="mx-2">Create .</p>
        <p className="mx-2">Collaborate .</p>
        <p className="mx-2">Conquer</p>
       </div>
        <div >
        <button className="font-lato ml-6 rounded-xl font-semibold h-10 w-20 border-white border-2 shadow-xl " onClick={()=>{nav('/landing')}} >View</button>
        <button className="font-lato ml-6 rounded-xl font-semibold h-10 w-20 border-white border-2 shadow-lg" >Login</button>
        </div>
        </div>
    )
}