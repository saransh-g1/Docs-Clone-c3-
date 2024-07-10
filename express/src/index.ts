import ws, { WebSocketServer,WebSocket } from "ws"
import { Server } from "socket.io";

import express from "express"
import {PrismaClient} from "@prisma/client"
import jwt, { JwtPayload } from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors"

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
const app=express();
app.use(cors())
var location="";
const httpServer = app.listen(8080, ()=>{console.log("foubu")})
const io = new Server(httpServer, { 
    cors:{
    origin: "http://localhost:5173",
    credentials: true
} });

io.on("connection", (socket) => {
  console.log(socket.id)
  
  socket.on("client",(msg)=>{
    console.log(msg)
    socket.broadcast.to("/"+location).emit("server",msg)
  })

socket.on("ref",(msg)=>{
  console.log(msg)
location=msg
socket.join("/"+location)
})

});






/////////////////////server//////////////////////////



const app2=express();
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
  })

})

app2.post("/api/v1/signin",async (req,res)=>{
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
 }

})

app2.post("/api/v1/savedocwithops",async(req,res)=>{
  const token=req.cookies.token;
  const decoded= jwt.verify(token, "123123") as JwtPayload;
  const body=req.body
  const user= await prisma.user.update({
    where:{
      id: decoded?.id,
    },
    data:{
      docs:{
        update:{
          data:{image: body.image, ops :body.ops},
          where:{id: body.id}
        }
      }
    }
  })
  const docs= await prisma.docs.findFirst({
    where:{
      id:body.id
    }
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
app2.listen(3000)
