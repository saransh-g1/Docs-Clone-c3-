import { SiGoogledocs } from "react-icons/si";
import { FiMenu } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import { IoMdPersonAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
export function Landing(){

  const nav= useNavigate()
    return(
        <div >
        <div className="h-16 border flex  items-center font-play pl-6 ">
          <FiMenu size={20} />
            <div className="flex w-24 hover:bg-gray-100 justify-center ml-4">
              <SiGoogledocs color="rgb(66, 133, 244)" size={34}/>
              <p className="font-bold text-stone-600 hover:text-black text-2xl ">C3</p>
              </div>
        </div>
        <div  className="flex flex-col items-center border-b b mx-12 pb-24 border-stone-400">
        <div  className="flex justify-center">
            <p className="text-6xl leading-snug font-sans w-5/6 mt-6 text-center">Build your best ideas together, in C3</p>
            </div>
            <p className="text-xl mt-10 font-sans mt-4  text-stone-500">Create and collaborate on online documents in real-time and from any device.</p>
            <div className="mt-12">
                <button className="bg-blue-600 rounded-md text-white h-12 w-36 font-semibold rounded-sm ">Try Docs For Work</button>
                <button className="text-blue-600 w-32 border h-12 ml-5 border-gray-300 rounded-md">Go To Docs</button>
              <div className=" mt-12 flex text-center ">
                <p className="text-lg mr-5 text-gray-800">Don't have an account?</p>
                <button className="text-lg text-blue-700" onClick={()=>{nav("/signup")}}>signup Now</button>
                </div>
                
            </div>
            </div>

            <div className="font-sans text-semibold text-stone-600 flex flex-col items-center my-3 px-12">
                <p className="mb-2">See what you can do here</p>
                <FaChevronDown  size={26}/>

                <div className="flex ">
                <div className="w-96"> 
                  <p className="font-semibold text-4xl text-black mb-4 mt-24">
                  Seamless collaboration, from anywhere</p>
                  <p className="font-semibold text-gray-500">Edit together in real-time with easy sharing, and use comments, suggestions, and action items to keep things moving. Or use @-mentions to pull relevant people, files, and events into your online Docs for rich collaboration.</p>
                 </div>
                    </div>

                    <div className="flex ">
                <div className="w-80"> 
                  <p className="font-semibold text-4xl text-black mb-4 mt-24">
                  Write faster with built-in intelligence</p>
                  <p className="font-semibold text-gray-500">Assistive features like Smart Compose help you write faster with fewer errors, so you can focus on ideas. And save time with spelling and grammar suggestions, voice typing, and quick document translation.</p>
                 </div>
                    </div>

                    <div className="flex mb-32">
                <div className="w-80"> 
                  <p className="font-semibold text-4xl text-black mb-4 mt-24">
                  Bring collaboration and intelligence to other file types
                  </p>
                  <p className="font-semibold text-gray-500">Easily edit Microsoft Word files online without converting them, and layer on Docs’ enhanced collaborative and assistive features like action items and Smart Compose. You can also import PDFs, making them instantly editable.</p>
                 </div>
                    </div>

                    <div className="flex justify-between bg-zinc-200 w-screen px-20 h-96 flex justify-between items-center">
                      <div className="w-80 flex flex-col justify-center ">
                        <button className="h-14 w-14 rounded-full bg-blue-600 flex justify-center items-center">
                            <IoMdPersonAdd size={34} color="white"></IoMdPersonAdd></button>
                    
                      <div className="">
                         <p className=" text-2xl text-black my-4 font-semibold">Do more with add-ons</p>
                      <p className="font-semibold text-zinc-500">Access a variety of third-party applications, right from Docs. Whether it's an e-signature app or project management tool, open it from Docs to work faster</p>
                  </div>
                         </div>

                         <div className="w-80 flex flex-col justify-center ">
                        <button className="h-14 w-14 rounded-full bg-blue-600 flex justify-center items-center">
                            <IoMdPersonAdd size={34} color="white"></IoMdPersonAdd></button>
                    
                      <div className="">
                         <p className=" text-2xl text-black my-4 font-semibold">Do more with add-ons</p>
                      <p className="font-semibold text-zinc-500">Access a variety of third-party applications, right from Docs. Whether it's an e-signature app or project management tool, open it from Docs to work faster</p>
                  </div>
                         </div>

                         <div className="w-80 flex flex-col justify-center ">
                        <button className="h-14 w-14 rounded-full bg-blue-600 flex justify-center items-center">
                            <IoMdPersonAdd size={34} color="white"></IoMdPersonAdd></button>
                    
                      <div className="">
                         <p className=" text-2xl text-black my-4 font-semibold">Do more with add-ons</p>
                      <p className="font-semibold text-zinc-500">Access a variety of third-party applications, right from Docs. Whether it's an e-signature app or project management tool, open it from Docs to work faster</p>
                  </div>
                         </div>
                    </div>
            </div>
        </div>
    )
}