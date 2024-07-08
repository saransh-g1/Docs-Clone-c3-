import { SiGoogledocs } from "react-icons/si";
import { FiMenu } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { HiEllipsisVertical } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import axios from "axios";
type doc={
    id: number,
    userId: number,
    image:string,
    ops: string
}
export function Dash(){
    const nav=useNavigate()
    const [docs, setdocs] =useState<doc[]>()

     useEffect(()=>{
         axios.get("http://localhost:3000/savedoc/images", {
            withCredentials: true,
          })
         .then((res)=>{
             console.log(res.data)
             console.log(res.data.user[0].docs)
             setdocs(res.data.user[0].docs)
         })
        
    },[])
    return(
        <div>
        <div className="flex justify-between h-16 border flex  items-center px-5  font-play ">
        <div className="flex  items-center ">
          <FiMenu size={20} />
            <div className="flex w-24 hover:bg-gray-100 justify-center ml-4">
              <SiGoogledocs color="rgb(66, 133, 244)" size={34}/>
              <p className="font-bold text-stone-600 hover:text-black text-2xl ">C3</p>
              </div>
              
        </div>
        <div className="flex justify-start mx-2 px-2 items-center h-12 w-2/5  bg-zinc-100 rounded-xl focus:bg-white hover:bg-zinc-200 has-[:focus]:bg-white hover:bg-zinc-200  has-[:focus]:shadow-xl ">
            <IoSearchOutline size={24}></IoSearchOutline>
        <input placeholder="search" className="ml-4 text-xl bg-transparent outline-none w-full font-lato focus: "></input>

        </div>
        <button className="bg-zinc-300 rounded-full w-10 h-10  ">s</button>
        </div>
        <div className=" bg-zinc-100 flex items-center justify-center h-96  ">
            <div className="flex-col w-max items-center justify-center ">
        <div className="mx-2 mb-6 flex justify-between">
            <p className=" font-lato font-bold text-zinc-700 text-xl">Start a new Document</p>
            <div className="flex font-lato font-bold text-zinc-700 text-xl items-center justify-center ">
            <button className="pr-6">Template</button>
            <HiEllipsisVertical size={30}/>
            </div>
            
        </div>
        <div className=" h-max flex items-center justify-center max-[480px]:flex  max-[480px]:flex-col">
            <div className="text-start mx-2">
              <button onClick={async()=>{
              const response= await axios.get("http://localhost:3000/api/v1/createDoc",{
                    withCredentials:true
                })
                const id= response.data.doc.id
                nav(`/edit/${id}`)}}><img src="https://ssl.gstatic.com/docs/templates/thumbnails/docs-blank-googlecolors.png" className="h-48 w-36 hover:outline hover:outline-2 hover: outline-blue-700 "></img></button>
              <p className="font-semibold font-lato text-zinc-600 ">Blank Document</p>
              </div>
              <div className="text-start mx-2  max-[480px]:hidden">
              <img src="https://ssl.gstatic.com/docs/templates/thumbnails/1TojfPV3jurwEV2RpmVqnCCCR4z9g2eQBZ40XTHPBqk8_400_3.png"  className="h-48 w-36 hover:outline hover:outline-2 hover: outline-blue-600 max-[480px]:hidden" alt=""></img>
              <p className="font-semibold font-lato text-zinc-600  max-[480px]:hidden">Blank Document</p> </div>
              <div className="text-start mx-2  max-[480px]:hidden">
              <img src="https://ssl.gstatic.com/docs/templates/thumbnails/10e8_E36oj6_LuCRzckBFX_9oqbCHntmYB-jxB5U9gsw_400_2.png"  className="h-48 w-36 hover:outline hover:outline-2 hover: outline-blue-600 max-[480px]:hidden" alt=""/>
              <p className="font-semibold font-lato text-zinc-600">Blank Document</p> </div>
              <div className="text-start mx-2  max-[480px]:hidden">
              <img src="https://ssl.gstatic.com/docs/templates/thumbnails/10bJALGfGJG8BrzBSmG6EznIq6-84l1TZkQ-HC8jO368_400.png"  className="h-48 w-36 hover:outline hover:outline-2 hover: outline-blue-600 max-[480px]:hidden" alt=""></img>
              <p className="font-semibold font-lato text-zinc-600">Blank Document</p></div>
              <div className="text-start mx-2  max-[480px]:hidden">
              <img src="https://ssl.gstatic.com/docs/templates/thumbnails/1wyFqxsRmKm9q--7j4WRmBMn694YdhV6hmNrfh4rVm2E_400.png"  className="h-48 w-36 hover:outline hover:outline-2 hover: outline-blue-600 max-[480px]:hidden" alt=""/>
              <p className="font-semibold font-lato text-zinc-600">Blank Document</p> </div>
        </div>
        </div>
        </div>

        <div className="flex justify-center items-center">
            <div style={{width:"800px"}} className="font-lato text-zinc-800 text-xl mt-5 flex justify-between">
                <p>Recent documentation</p>
                <div className="focus: w-auto">
                <select className="box-border font-lato font-semibold outline-none active:bg-zinc-300" >
                    <option className="font-lato font-semibold outline-none bg-white hover:bg-zinc-200 ">owned by me</option>
                    <option className="font-lato font-semibold outline-none bg-white hover:bg-zinc-200">Not owned by me</option>
                    <option className="font-lato font-semibold outline-none bg-white hover:bg-zinc-200">All</option>

                </select>
                </div>
            </div>
        </div>
        <div className="flex justify-start items-center mx-64 my-5 max-[480]:grid max-[480]:grid-cols-2">
       {docs?.map((image:any,index:any)=>{console.log(image.image); console.log(index); return <button onClick={()=>{nav("/edit/"+image.id)}}><img key={image.id} src={image.image} className="h-48 w-36 mx-5 border rounded-sm hover:outline hover:outline-2 hover: outline-blue-600 border-2 border-indigo-400 max-[480]:h-20"></img></button>})}
        </div>
        </div>
    )
}