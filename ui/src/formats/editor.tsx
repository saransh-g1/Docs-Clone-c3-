// Importing helper modules
import { pdfExporter } from 'quill-to-pdf';
import { saveAs } from 'file-saver';
import { Delta } from "quill/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./editor.css"
import { socket } from './socket'
// Importing core components
import QuillEditor, { Quill } from "react-quill";

// Importing styles
import "react-quill/dist/quill.snow.css";
import {toPng} from "html-to-image"
import axios from "axios"
 

const Editor = () => {
  // Editor state
  const [value, setValue] = useState("");
  const [msg, setmsg]= useState<string>("")
  const [editor, setEditor]= useState<Boolean>(false)

  const elementRef = useRef(document.body);

  useEffect(()=>{ 
    const quiller=new Quill("#editer", {
      modules:{
        toolbar: "#toolbar-container"
      },
        theme: 'snow'
      })

      console.log(socket)
      ///socket/////////////////////////////////
     
       
  
       socket.emit("ref",window.location.href.split("/")[4])
     console.log(window.location.href.split("/")[4])
  
     
       socket.on("server",(msg)=>{
        console.log(socket.connected)
         console.log(msg)
         quiller.updateContents(msg)
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
     
    


    const location=window.location.href
    const docid=location.split("/")
    console.log(docid[4])
   axios.post("http://localhost:3000/api/v1/getsavedoc",{
    id: parseInt(docid[4]),
   },{
    withCredentials:true
   }).then(res=>{
    console.log(res.data)
   localStorage.setItem("ops",res.data.docs.ops)

   const operations=localStorage.getItem("ops")
   if(operations!=null){
    const arry=JSON.parse(operations)
    const array=arry.ops
    console.log(array)
    quiller.updateContents(array)
   }
   })


   
    
   
   

  console.log(editor)
  console.log("hello")

  quiller.on("text-change",(delta:any, oldDelta:any, source:any) => {
    if (source == 'api') {
      console.log('An API call triggered this change.');
      
    } else if (source == 'user') {
      console.log('A user action triggered this change.');
      localStorage.setItem("ops",JSON.stringify(quiller.getContents()))
      socket.emit("client", delta.ops)
     setmsg(JSON.stringify(quiller.getContents()))
      // newSocket.send(JSON.stringify(delta.ops))
     
    }
  });
  

  return () =>{ 
    socket.off('connect',()=>{console.log("hello")});
    socket.off('disconnect',()=>{console.log("hello")});

  }

},[])
 
  

 async function pdf(){
  
const pdfAsBlob = await pdfExporter.generatePdf(JSON.parse(msg)); // converts to PDF
  saveAs(pdfAsBlob, 'pdf-export.pdf');
 }

 const htmlToImageConvert = () => {
  toPng(elementRef.current, { cacheBust: false })
    .then((dataUrl) => {
      const link = document.createElement("a");
      link.href = dataUrl;
      console.log(dataUrl)
      axios.post("http://localhost:3000/api/v1/savedoc",{
        image:dataUrl,
        ops:"hi"
      },{
        withCredentials:true,
      }).then((res)=>{
          console.log(res.data)
      })
      link.click();
    })
    .catch((err) => {
      console.log(err);
    });
};

function docsSaving(){
  const ops=localStorage.getItem("ops")

  
    toPng(elementRef.current, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        axios.post("http://localhost:3000/api/v1/savedocwithops",{
          id: parseInt(window.location.href.split("/")[4]),
          image:dataUrl,
          ops:ops
        },{
          withCredentials:true,
        }).then((res)=>{
            console.log(res.data)
        })
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };


  function Websocket(){
    socket.on("connect", () => {
      console.log(socket.id)

    });

    socket.on("disconnect",()=>{
      console.log("disconnect")
    })
  }

  return (
    <div className="flex flex-col items-center justify-center"> 

<button onClick={docsSaving}>Get your docs saved</button>
<button onClick={Websocket}>Real time collab</button>
         <div id="toolbar-container" className="rounded-full bg-blue-100 my-3 w-full flex justify-center block">
  <span className="ql-formats">
    <select className="ql-font"></select>
    <select className="ql-size"></select>
  </span>
  <span className="ql-formats">
    <button className="ql-bold"></button>
    <button className="ql-italic"></button>
    <button className="ql-underline"></button>
    <button className="ql-strike"></button>
  </span>
  <span className="ql-formats">
    <select className="ql-color"></select>
    <select className="ql-background"></select>
  </span>
  <span className="ql-formats">
    <button className="ql-script" value="sub"></button>
    <button className="ql-script" value="super"></button>
  </span>
  <span className="ql-formats">
    <button className="ql-header" value="1"></button>
    <button className="ql-header" value="2"></button>
    <button className="ql-blockquote"></button>
    <button className="ql-code-block"></button>
  </span>
  <span className="ql-formats">
    <button className="ql-list" value="ordered"></button>
    <button className="ql-list" value="bullet"></button>
    <button className="ql-indent" value="-1"></button>
    <button className="ql-indent" value="+1"></button>
  </span>
  <span className="ql-formats">
    <button className="ql-direction" value="rtl"></button>
    <select className="ql-align"></select>
  </span>
  <span className="ql-formats">
    <button className="ql-link"></button>
    <button className="ql-image"></button>
    <button className="ql-video"></button>
    <button className="ql-formula"></button>
  </span>
  <span className="ql-formats">
    <button className="ql-clean"></button>
  </span>
  <span>
    <button onClick={pdf}>generate</button>
    <button onClick={async()=>{
  
      htmlToImageConvert()}}>save</button>
  </span>
</div>



    <div id="editer" className="w-1/2 h-screen my-3 block overflow-hidden	" style={{borderTop:"px"}} ref={elementRef}>
  
  </div>
   


</div>
  );
};

export default Editor;