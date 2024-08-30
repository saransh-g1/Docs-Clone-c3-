// Importing helper modules

import {  useEffect, useState } from "react";
import ResizeModule from "@botom/quill-resize-module";
import QuillCursors from 'quill-cursors';

import "./editor.css"
import { MdLockOutline, MdOutlineStarBorder } from "react-icons/md";
import { MdOutlinePersonAddAlt } from "react-icons/md";
import { GiAbacus, GiSolidLeaf } from "react-icons/gi";
import { GiScorpion } from 'react-icons/gi';
// Importing core components
import  { Quill } from "react-quill";
import { io } from 'socket.io-client';
// Importing styles
import "react-quill/dist/quill.snow.css";
import {toPng} from "html-to-image"
import axios from "axios"
import {SiGoogledocs} from "react-icons/si"
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { TbBrandOnedrive } from 'react-icons/tb';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';


interface data{
  user:string,
  location:string
}

const color=[
"yellowgreen",
"aqua",
"aquamarine",
"plum",
"powderblue",
"black",
"darkgray",
"mediumpurple",
"skyblue",
"steelblue",
"turquoise",
"sandybrown",
"sienna",
"chocolate",
"darkmagenta"
]

const Editor = () => {
  // Editor state
  const [status,setStatus]=useState(false)
 const [loader,setLoader]=useState<boolean>(false)
 const [hidden,setHidden]=useState(false)
 const [userInRoom, setUserInRoom]=useState<data[]>([]);
 const [cursorinRoom, setcursorinRoom]=useState<any>([]);
  const nav=useNavigate()
  useEffect(()=>{ 
const url=process.env.PORT
    const  socket= io();
    const location=window.location.href
    const docid=location.split("/")
    setLoader(true)
    axios.post("https://docs-clone-c3.vercel.app/api/v1/userConnectionDoc",{
      docsId:parseInt(docid[4])
    },{
      withCredentials:true
     }).then(res=>{
      console.log(res.data)
      axios.post("https://docs-clone-c3.vercel.app/api/v2/cachedDocs",{
        docsId: parseInt(docid[4]),
       },{
        withCredentials:true
       }).then(res=>{
        console.log(res.data)
       localStorage.setItem("ops",res.data.response)
    
       const operations=localStorage.getItem("ops")
       if(operations!=null){
        setLoader(false)

        const arry=JSON.parse(operations)
        const array=arry.ops
        console.log(array)
        quiller.updateContents(array)
       }
       })
    
    })
    Quill.register("modules/resize", ResizeModule);
    Quill.register('modules/cursors', QuillCursors);
    const quiller=new Quill("#editer", {
      modules:{
        cursors:{  
          transformOnTextChange: true,

        },
        resize: {
        locale: {
          // change them depending on your language
          altTip: "Hold down the alt key to zoom",
          floatLeft: "Left",
          floatRight: "Right",
          center: "Center",
          restore: "Restore",
        },
      },
        toolbar: "#toolbar-container"
      }, 
        theme: 'snow',
        readOnly: status
      })
     

      

      console.log(socket)
      ///socket/////////////////////////////////
     
  
       socket.emit("ref",{location: window.location.href.split("/")[4], user: localStorage.getItem("email")?.split("@")[0]})
     console.log(window.location.href.split("/")[4])
  
    //  socket.emit("clientId",userEmail);

      socket.on("commit",(msg)=>{ console.log(msg); })

       socket.on("server",(msg)=>{
        console.log(socket.connected)
         console.log(msg)
         quiller.updateContents(msg.data)
         localStorage.setItem("ops",JSON.stringify(quiller.getContents()))
      
        })
      
        const cursorsTwo:any = quiller.getModule('cursors');

        socket.on("socketCommit",async(msg)=>{msg.map((e:any)=>{console.log(e.user)})
        // await new Promise((res)=> setTimeout(res,200));
       const cursorarray=[];
        for(var i=0; i<msg.length; i++){
          if(msg[i].user!=localStorage.getItem("email")?.split("@")[0]){
          cursorsTwo.createCursor(msg[i].user, msg[i].user, color[i]);
          console.log(cursorsTwo._cursors)
          cursorarray.push(cursorsTwo);
          }
        }
        setcursorinRoom(cursorarray)
         setUserInRoom(msg)
})

    // const newSocket = new WebSocket('ws://localhost:8080');
    // newSocket.onopen = () => {
    //   console.log('Connection established');
      
    // }
    // newSocket.onmessage = (message) => {
    //   console.log('Message received:', message.data);
    //   console.log(JSON.parse(message.data))
    //   quiller.updateContents(JSON.parse(message.data))
      
    // }
    
    // setSocket(newSocket);
     
    


   
    console.log(docid[4])


   
    
   
   


  quiller.on("text-change",(delta:any, oldDelta:any, source:any) => {
    console.log(oldDelta);
    // console.log(quiller.getLines()[0].parent.children.length)
    // console.log(quiller.getSelection())
    if (source == 'api') {
      
    } else if (source == 'user') {
      localStorage.setItem("ops",JSON.stringify(quiller.getContents()))
      socket.emit("client", {data:delta.ops, location: window.location.href.split("/")[4], document: JSON.stringify(quiller.getContents())})
   //  setmsg(JSON.stringify(quiller.getContents()))
      // newSocket.send(JSON.stringify(delta.ops))
     
    }
  }); 

  ///////////////////cursor/////////////////////////////////////

const cursorsOne:any = quiller.getModule('cursors');
  cursorsOne.createCursor('cursor', "user1", 'green');

 
  
   socket.on("cursor-server",(msg)=>{
    console.log(msg)
    console.log(cursorinRoom.length)
  //  const cursorRequired=cursorinRoom.filter((e:any)=>e.)
    setTimeout(() => cursorsTwo.moveCursor(msg.user,msg.range), 500);

   })
  quiller.on("selection-change",(range:any, oldRange:any, source:any) => {
  console.log(oldRange);
    if (source == 'api') {
    console.log(range)
      console.log("hekabllo");
    } else if (source == 'user') {
      setTimeout(() => cursorsOne.moveCursor('cursor', range), 500);
           socket.emit("cursor-client",{range:range, location: window.location.href.split("/")[4],user:localStorage.getItem("email")?.split("@")[0]});
    }
  }); 

  socket.on('disconnect',()=>{console.log("hello")});


  return () =>{ 
    
   console.log
  
    socket.off('connect',()=>{console.log("hello")});
    socket.off('disconnect',()=>{console.log("hello")});
  }

},[])
 




//  async function pdf(){
  
// const pdfAsBlob = await pdfExporter.generatePdf(JSON.parse(msg)); // converts to PDF
//   saveAs(pdfAsBlob, 'pdf-export.pdf');
//  }

//  const htmlToImageConvert = () => {
//   toPng(elementRef.current, { cacheBust: false })
//     .then((dataUrl) => {
//       const link = document.createElement("a");
//       link.href = dataUrl;
//       console.log(dataUrl)
//       axios.post("https://docs-clone-c3.vercel.app/api/v1/savedoc",{
//         image:dataUrl,
//         ops:"hi"
//       },{
//         withCredentials:true,
//       }).then((res)=>{
//           console.log(res.data)
//       })
//       link.click();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

function docsSaving(){
  const ops=localStorage.getItem("ops")
const ele:any=document.getElementById("editer")
  
    toPng(ele, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        setLoader(true);
        axios.post("https://docs-clone-c3.vercel.app/api/v1/savedocwithops",{
          id: parseInt(window.location.href.split("/")[4]),
          image:dataUrl,
          ops:ops
        },{
          withCredentials:true,
        }).then((res)=>{
            console.log(res.data)
            setLoader(false)
        })
        link.click();
      
      })
      .catch((err) => {
        console.log(err);
      });
  }


  

  return (
    <div className="flex flex-col items-center justify-center"> 
    <div className='flex justify-between my-1 items-center w-full mx-3' id="top"> 
      <div className='flex items-center justify-center'>
      <button onClick={()=>{nav("/dashboard"); window.location.reload()}}><SiGoogledocs color="rgb(66, 133, 244)" size={40}/></button>
      <div>
        <div className='flex *:font-lato *:mx-1 items-center justify-center'>
      <div contentEditable="true" className='text-xl font-lato outline-none focus:outline focus:outline-blue-400 overflow-none w-max rounded-lg *:mx-1' suppressContentEditableWarning={true} >Untitled document</div>
      <MdOutlineStarBorder size={20}></MdOutlineStarBorder>
      <TbBrandOnedrive size={20}></TbBrandOnedrive>
      </div>
      <div className='flex *:font-lato *:mx-1'>
         <button>file</button>
         <button>insert</button>
         <button className="text-blue-400" onClick={()=>{   
console.log(loader)
docsSaving();
console.log(loader)

setLoader(false);}}>save</button>
         <button>help</button>
      </div>
      </div>
      </div>
      
    <div className='flex justify-center items-center'>
    
      <div className='flex items-center justify-center mx-4'>
        {/* {userInRoom.map((e:any)=>{
          return <button className='rounded-full h-10 w-10 text-white bg-slate-400 mx-3'>{e.user}</button>
        })} */}
         {userInRoom[0]? <button className='rounded-full h-10 w-10 text-xl text-white bg-red-500 border-green-400 border-2 relative z-30 -ml-4 flex items-center justify-center font-lato  '><GiSolidLeaf size={24}></GiSolidLeaf></button>:<></>}
         {userInRoom[1]? <button className='rounded-full h-10 w-10 text-xl text-white bg-red-500 border-green-400 border-2 -ml-4 relative z-20 flex items-center justify-center font-lato'><GiScorpion size={24}></GiScorpion></button>:<></>}
         {userInRoom[2]? <button className='rounded-full h-10 w-10 text-xl text-white bg-red-500 border-green-400 border-2 -ml-4 relative z-10  flex items-center justify-center font-lato'><GiAbacus size={24}/></button>:<></>}
         {userInRoom[3]?  <button className='rounded-full h-10 w-10  bg-white font-extrabold  border-green-400 border-2 -ml-4 flex items-center justify-center text-blue-500 bg-gray-200'><MdOutlinePersonAddAlt size={30}/></button>:<></>}
        

      </div>
      <div className='group flex '>
      <dialog className='border-none outline-none rounded-lg font-lato'>
        <div className='w-[400px] h-max bg-white rounded-lg p-7'>
           <p className='text-2xl '>Share 'Untitled document'</p>
           <p className='my-4'>People with access</p>
          <div className='flex justify-between my-4'>
            <div className='flex items-center '>
               <p className='text-xl  mr-4 rounded-full bg-slate-400 text-white h-10 w-10 flex justify-center items-center'>{localStorage.getItem("email")?.substring(0,1)}</p>
               <div className='flex flex-col'>
                <p>{localStorage.getItem("email")?.split("@")[0]}</p>
                <p>{localStorage.getItem("email")}</p>
               </div>
               </div>
               <p className='text-slate-600 flex justify-center items-center'>owner
                </p>
          </div>
          
          <div className='flex justify-between items-center my-8'>
            <button className='border border-slate-400 text-blue-600 rounded-full px-6 py-1' onClick={()=>navigator.clipboard.writeText(window.location.href)}>copy Link</button>
            <button className='bg-blue-600 rounded-full text-xl text-white font-semibold px-6 py-1' onClick={()=>{document.querySelector('dialog')?.close()}}>Done</button>
          </div>
        </div>
        </dialog>
 <button className='flex text-xl px-4 py-2 h-10 bg-blue-200 rounded-l-full w-28 font-lato *:mx-1 '  onClick={() =>{document.querySelector('dialog')!.showModal();  }}><MdLockOutline size={23}></MdLockOutline> Share</button>
 </div> 
 <button className='flex text-xl bg-blue-200 rounded-r-full w-8 h-10 font-lato *:mx-1 flex items-center justify-center border-l-4 border-yellow-100'><IoIosArrowDown size={16}></IoIosArrowDown></button>

  <button className='rounded-full h-10 w-10 text-white bg-slate-400 mx-3 text-3xl text-center flex items-center justify-center font-lato'>{localStorage.getItem("email")?.substring(0,1)}</button>
</div>
    </div>

         <div id="toolbar-container" className="rounded-full bg-blue-50 my-3 h-10 w-full flex justify-center block">
  <span className="ql-formats">
    <select className="ql-font"></select>
    <select className="ql-size"></select>
  </span>
  <span className="ql-formats" style={{borderLeft:"1px solid",borderRight:"1px solid", width:"10%",display:"flex",alignItems:"center", justifyContent:"center" }}>
    <button className="ql-bold"></button>
    <button className="ql-italic"></button>
    <button className="ql-underline"></button>
    <button className="ql-strike"></button>
  </span>
  <span className="ql-formats" style={{borderRight:"1px solid", display:"flex",alignItems:"center", justifyContent:"center" }}>
    <select className="ql-color"></select>
    <select className="ql-background"></select>
  </span>
  <span className="ql-formats" style={{borderRight:"1px solid",display:"flex",alignItems:"center", justifyContent:"center" }}>
    <button className="ql-script" value="sub"></button>
    <button className="ql-script" value="super"></button>
  </span>
  <span className="ql-formats" style={{borderRight:"1px solid", width:"8%",display:"flex",alignItems:"center", justifyContent:"center" }}>
    <button className="ql-header" value="1"></button>
    <button className="ql-header" value="2"></button>
    <button className="ql-blockquote"></button>
    <button className="ql-code-block"></button>
  </span>
  <span className="ql-formats" style={{borderRight:"1px solid", width:"10%",display:"flex",alignItems:"center", justifyContent:"center" }}>
    <button className="ql-list" value="ordered"></button>
    <button className="ql-list" value="bullet"></button>
    <button className="ql-indent" value="-1"></button>
    <button className="ql-indent" value="+1"></button>
  </span>
  <span className="ql-formats" >
    <button className="ql-direction" value="rtl"></button>
    <select className="ql-align"></select>
  </span>
  <span className="ql-formats" >
    <button className="ql-link"></button>
    <button className="ql-image"></button>
    <button className="ql-video"></button>
    <button className="ql-formula"></button>
  </span>
  <span className="ql-formats" >
    <button className="ql-clean"></button>
  </span>
  <span className="ql-formats">
   {status===false? <div className='w-24 flex flex-col items-center justify-center *:mx-2 group' ><button className="flex flex-col items-center justify-center " onClick={()=>{setStatus(true)}}><div>✏️Editing</div></button></div>: <div className='w-24 flex flex-col items-center justify-center *:mx-2 group' ><button className="flex flex-col items-center justify-center " onClick={()=>{setStatus(false)}}><div>📖Reading</div></button></div>}
  </span>
  <span className='ql-formats' style={{display:"flex", alignItems:"center", justifyContent:"flex-end"}}>
  
    {hidden? <button className='mx-1' onClick={()=>{
      document.getElementById("top")!.className="hidden flex justify-between my-1 items-center w-full mx-3"
      setHidden((hidden)=>!hidden)
      console.log(hidden)
    }}><IoIosArrowDown size={16}></IoIosArrowDown></button>    :  <button className='mx-1' onClick={()=>{
      document.getElementById("top")!.className="block flex justify-between my-1 items-center w-full mx-3"
      setHidden((hidden)=>!hidden)
      console.log(hidden)
    }}><IoIosArrowUp size={16}></IoIosArrowUp></button>}
    
  </span>
</div>



    <div id="editer" className="w-1/2 min-h-screen my-3 block " style={{borderTop:"px"}}> </div>

   {loader? <div  className='z-10 absolute top-1/2'> <ClipLoader  loading={loader}
       size={40} 
       aria-label="Loading Spinner"
       data-testid="loader"></ClipLoader></div>: <></>}
     
</div>

  );
};

export default Editor;