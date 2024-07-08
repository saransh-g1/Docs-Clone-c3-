"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
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
const app = (0, express_1.default)();
var location = "";
const httpServer = app.listen(8080, () => { console.log("foubu"); });
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});
io.on("connection", (socket) => {
    console.log(socket.id);
    socket.on("client", (msg) => {
        console.log(msg);
        socket.broadcast.to("/" + location).emit("server", msg);
    });
    socket.on("ref", (msg) => {
        console.log(msg);
        location = msg;
        socket.join("/" + location);
    });
});
/////////////////////server//////////////////////////
const app2 = (0, express_1.default)();
app2.use((0, cookie_parser_1.default)());
app2.use(express_1.default.json({ limit: '50mb' }));
app2.use((0, cors_1.default)({
    credentials: true,
    origin: "http://localhost:5173"
}));
const prisma = new client_1.PrismaClient();
app2.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const email = body.email;
    const user = yield prisma.user.create({
        data: {
            email: body.email,
            uid: body.uid,
        },
    });
    const jwttoken = jsonwebtoken_1.default.sign({ id: user.id }, "123123");
    res.cookie("token", jwttoken);
    res.json({
        msg: "user created succesfully",
        jwttoken
    });
}));
app2.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const user = yield prisma.user.findFirst({
        where: {
            email: body.email
        }
    });
    if (user) {
        const jwttoken = jsonwebtoken_1.default.sign({ id: user.id }, "123123");
        res.cookie("token", jwttoken);
        res.json({
            msg: "user got",
            jwttoken
        });
    }
    else {
        res.json({
            msg: "error occured"
        });
    }
}));
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
app2.post("/api/v1/savedoc", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    const decoded = jsonwebtoken_1.default.verify(token, "123123");
    const body = req.body;
    const user = yield prisma.user.update({
        where: { id: decoded === null || decoded === void 0 ? void 0 : decoded.id },
        data: {
            docs: {
                upsert: {
                    create: { image: body.image, ops: body.ops },
                    update: { image: body.image, ops: body.ops },
                    where: { id: 1 }
                },
            },
        },
    });
    if (user != null) {
        res.json({
            msg: "docs created successfully sljn",
            user,
        });
    }
    else {
        res.json({
            msg: "brutal error"
        });
    }
}));
app2.post("/api/v1/savedocwithops", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    const decoded = jsonwebtoken_1.default.verify(token, "123123");
    const body = req.body;
    const user = yield prisma.user.update({
        where: {
            id: decoded === null || decoded === void 0 ? void 0 : decoded.id,
        },
        data: {
            docs: {
                update: {
                    data: { image: body.image, ops: body.ops },
                    where: { id: body.id }
                }
            }
        }
    });
    const docs = yield prisma.docs.findFirst({
        where: {
            id: body.id
        }
    });
    res.json({
        msg: "updated",
        docs
    });
}));
app2.get("/api/v1/createDoc", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    const decoded = jsonwebtoken_1.default.verify(token, "123123");
    const doc = yield prisma.docs.create({
        data: {
            userId: decoded === null || decoded === void 0 ? void 0 : decoded.id,
            image: "",
            ops: ""
        }
    });
    res.json({
        doc
    });
}));
app2.get("/savedoc/images", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    console.log(token);
    const decoded = jsonwebtoken_1.default.verify(token, "123123");
    const user = yield prisma.user.findMany({
        where: {
            id: decoded === null || decoded === void 0 ? void 0 : decoded.id
        },
        include: {
            docs: true
        }
    });
    res.json({
        msg: "result=",
        user
    });
}));
app2.post("/api/v1/getsavedoc", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    const decoded = jsonwebtoken_1.default.verify(token, "123123");
    const body = req.body;
    const docs = yield prisma.docs.findFirst({
        where: {
            id: body.id,
            userId: decoded === null || decoded === void 0 ? void 0 : decoded.id
        }
    });
    res.json({
        msg: "got it",
        docs
    });
}));
app2.listen(3000);
