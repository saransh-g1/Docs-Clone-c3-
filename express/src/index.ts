import ws, { WebSocketServer,WebSocket } from "ws"
import { Server, Socket } from "socket.io";

import express from "express"
import {PrismaClient} from "@prisma/client"
import jwt, { JwtPayload } from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors"
import client from "./redis"
// const wss=new WebSocketServer({server});

// wss.on("connection",function connection(ws){
  
//   ws.on("error",console.error)

//   console.log("successfully connected")
// ws.on("message",(data, isBinary)=>{
//   wss.clients.forEach(function each(client) {
//     if (client.readyState === WebSocket.OPEN && client !== ws) {
//       client.send(data, { binary: isBinary });
//     }
//   });
// })
 
  
// })


////ws///////////////////////////////////////////////////////////////////
interface ExtendedSocket extends Socket {
  username?: string,
  location?: string
}

interface data{
  location:string,
  user:string
}
var memory:data[]=[];
const app2=express();


var location="";
const httpServer = app2.listen(3000, ()=>{console.log("foubu")})
const io = new Server(httpServer, { 
    cors:{
    origin: "http://localhost:5173",
    credentials: true
} });

io.on("connection", async(socket:ExtendedSocket) => {
  
  
  socket.on("client",async(msg)=>{
    const docsId=msg.location;
    try{
    await client.set(docsId,msg.document);
  }catch(e){
    console.log(e)
  }
    socket.broadcast.to("/"+msg.location).emit("server",msg)
  })


  socket.on("cursor-client",(msg)=>{
    console.log(msg.range);
    socket.broadcast.to("/"+msg.location).emit("cursor-server",{range:msg.range,user:msg.user})
  })

  socket.on("disconnect",async(msg)=>{
   memory=[];
  
    const sockets:any = await io.fetchSockets();
    for(const socket of sockets){
      memory.push({location:socket.location,user:socket.username})
      // console.log(socket.rooms)
      // await new Promise((res)=> setTimeout(res,200));
      // socket.broadcast.to("/1").emit("socketCommit",socket.username)
      // console.log(socket.username+"refSockets")
    }
     for(const socket of sockets){
      socket.emit("socketCommit",memory);
     }


   
  })

socket.on("ref",async(msg)=>{
  memory=[];
socket.username=msg.user;
socket.location=msg.location;
location=msg.location;

// const manysocket= await io.sockets.clients('room');
// manysocket.map((e:any)=>{console.log(e.username)
// })

 socket.join("/"+location)


const sockets: any = await io.in("/"+location).fetchSockets();
  for(const socket of sockets){
    memory.push({location:socket.location,user:socket.username})
    // console.log(socket.rooms)
    // await new Promise((res)=> setTimeout(res,200));
    // socket.broadcast.to("/1").emit("socketCommit",socket.username)
    // console.log(socket.username+"refSockets")
  }
   for(const socket of sockets){
    socket.emit("socketCommit",memory);
   }
// await new Promise(res=>setTimeout(res,1000))
// console.log(memory)
// memory.map((e)=>{
//   console.log(e.location+"helll")
//   socket.to("/"+e.location).emit("commit",e.user);
// })
})

});




/////////////////////server//////////////////////////



app2.use(cookieParser())
app2.use(express.json({limit:'50mb'}))
app2.use(cors({
  credentials: true,
  origin: "http://localhost:5173"
}));
const prisma=new PrismaClient();






type signup={
  email : string,
  uid : string,
}


app2.post("/api/v1/signup",async (req,res)=>{
  try{
  const body : signup=req.body;
  const email=body.email
  const user= await prisma.user.create({
    data: {
      email: body.email,
      uid : body.uid,
    },

  });
const jwttoken= jwt.sign({id:user.id},"123123")
res.cookie("token", jwttoken);
  res.json({
    msg: "user created succesfully",
    jwttoken
  })}catch(e){
    console.log(e);
  }

})

app2.post("/api/v1/signin",async (req,res)=>{
  try{
  const body:signup=req.body;
  const user= await prisma.user.findFirst({
    where:{
      email:body.email
    }
   
  });
  if(user){
  const jwttoken= jwt.sign({id:user.id},"123123")
  res.cookie("token", jwttoken);
    res.json({
      msg: "user got",
      jwttoken
    })  
  }else{
    res.json({
      msg : "error occured"
    })
  }
}catch(e){
  console.log(e)
}
})


// app2.use(async (req,res,next)=>{
//    const token= req.cookies.token

//    const decoded = jwt.verify(token, "123123") as JwtPayload;
//    const user= await prisma.user.findFirst({
//   where:{
//     id: decoded?.id
//   }
// })
// if(user!=null){
//   next()
// }else{
//   res.json({
//     msg:"error"
//   })
// }

// })

app2.post("/api/v1/savedoc",async(req,res)=>{
  try{
  const token=req.cookies.token;
  const decoded= jwt.verify(token, "123123") as JwtPayload;
const body=req.body

 const user = await prisma.user.update({
  where: { id: decoded?.id },
  data: {
    docs: {
      upsert: {
        create: { image: body.image, ops: body.ops },
        update: { image: body.image, ops: body.ops },
        where:{id: 1}
      },
    },
  },
})

 if(user!=null){
  res.json({
    msg:"docs created successfully sljn",
    user,
    
  })
 }else{
  res.json({
    msg:"brutal error"
  })
 }}catch(e){
  console.log(e);
 }

})

app2.post("/api/v1/savedocwithops",async(req,res)=>{
  const token=req.cookies.token;
  const decoded= jwt.verify(token, "123123") as JwtPayload;
  const body=req.body
 
  const docs= await prisma.docs.update({
    where:{
      id:body.id
    },
    
    data:{image: body.image, ops :body.ops},
          
      
   
  })
  
  res.json({
    msg:"updated",
    docs
  })
})
 
app2.get("/api/v1/createDoc",async(req,res)=>{
  const token= req.cookies.token
  const decoded= jwt.verify(token, "123123") as JwtPayload;

  const doc=await prisma.docs.create({
    data:{
       userId:decoded?.id,
       image: "",
       ops: ""
    }
  })
  res.json({
    doc
  })
})


app2.get("/savedoc/images",async(req,res)=>{
  const token=req.cookies.token;
  console.log(token)
  const decoded= jwt.verify(token, "123123") as JwtPayload;
  const user= await prisma.user.findMany({
    where:{
      id: decoded?.id
    },
    include:{
      docs:true
    }
    })
  res.json({
    msg:"result=",
    user
  })
})

app2.post("/api/v1/getsavedoc",async(req,res)=>{
  const token=req.cookies.token;
  const decoded= jwt.verify(token, "123123") as JwtPayload;
  const body=req.body
  if(decoded?.id==null) return res.json({msg:"error"})
  const docs=await prisma.docs.findFirst({
  where:{
    id: body.id,
  }
})
 res.json({
  msg:"got it",
  docs
 })

})

app2.post("/api/v1/userConnectionDoc",async(req,res)=>{
  const token=req.cookies.token;
  const decoded= jwt.verify(token, "123123") as JwtPayload;
  const body=req.body
  if(decoded?.id==null) return res.json({msg:"error"})
   const finduserwithdocs=await prisma.userConnectedToDocs.findFirst({
  where:{
    userId:decoded?.id,
    docsId:body.docsId
  }})
  if(finduserwithdocs===null){
    const createuserwithdocs=await prisma.userConnectedToDocs.create({
      data:{
        userId:decoded?.id,
        docsId: body.docsId
         }
    })
    return res.json({
      msg:"created",
      createuserwithdocs
    })
  }
  res.json({
    msg:"already exist",
    finduserwithdocs
  })
})



app2.get("/api/v1/getdocswithconnecteduser",async(req,res)=>{
  const token=req.cookies.token;
  const decoded= jwt.verify(token, "123123") as JwtPayload;
 
  if(decoded?.id==null) return res.json({msg:"error"})
  const user= await prisma.userConnectedToDocs.findMany({
where:{
  userId: decoded?.id,
},
include:{
  docs:true
}
})
res.json({
   user
})
})


app2.post("/api/v1/getspecificdocscontouser",async(req,res)=>{
//   const token=req.cookies.token;
//   const decoded= jwt.verify(token, "123123") as JwtPayload;
//  const body=req.body
  //if(decoded?.id==null) return res.json({msg:"error"})
const start=performance.now()
  const user= await prisma.userConnectedToDocs.findMany({
where:{
  
  userId: 1,
  docsId: 1
},
include:{
  docs:true
}
})
const end=performance.now()
console.log(user[0].docs.ops);
res.json({
   user,
   time: start-end

})
})


app2.post("/api/v2/cachedDocs",async(req,res)=>{
  const start=performance.now()


   const token=req.cookies.token;
   const decoded= jwt.verify(token, "123123") as JwtPayload;
   const body=req.body
   if(decoded?.id==null) return res.json({msg:"error"});

           const response=await client.get(body.docsId.toString())

           res.json({
            response
           })
           console.log(response);

    if(response==null){
      const user= await prisma.userConnectedToDocs.findMany({
        where:{
          
          userId: decoded?.id,
          docsId: body.docsId
        },
        include:{
          docs:true
        }
        })
        console.log(user[0].docs.ops);

        
        await client.set(body.docsId,"")
       
        return res.json({
           response: user[0].docs.ops,

        })
    }
   
  });



















app2.get("/trial",async(req,res)=>{
  var valu;
  const msg=await client.get("msg")
})





