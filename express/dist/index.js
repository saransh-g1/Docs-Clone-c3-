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
const redis_1 = __importDefault(require("./redis"));
var memory = [];
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
var location = "";
const httpServer = app.listen(8080, () => { console.log("foubu"); });
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    socket.on("client", (msg) => __awaiter(void 0, void 0, void 0, function* () {
        const docsId = msg.location;
        try {
            yield redis_1.default.set(docsId, msg.document);
        }
        catch (e) {
            console.log(e);
        }
        socket.broadcast.to("/" + msg.location).emit("server", msg);
    }));
    socket.on("cursor-client", (msg) => {
        console.log(msg.range);
        socket.broadcast.to("/" + msg.location).emit("cursor-server", { range: msg.range, user: msg.user });
    });
    socket.on("disconnect", (msg) => __awaiter(void 0, void 0, void 0, function* () {
        memory = [];
        const sockets = yield io.fetchSockets();
        for (const socket of sockets) {
            memory.push({ location: socket.location, user: socket.username });
            // console.log(socket.rooms)
            // await new Promise((res)=> setTimeout(res,200));
            // socket.broadcast.to("/1").emit("socketCommit",socket.username)
            // console.log(socket.username+"refSockets")
        }
        for (const socket of sockets) {
            socket.emit("socketCommit", memory);
        }
    }));
    socket.on("ref", (msg) => __awaiter(void 0, void 0, void 0, function* () {
        memory = [];
        socket.username = msg.user;
        socket.location = msg.location;
        location = msg.location;
        // const manysocket= await io.sockets.clients('room');
        // manysocket.map((e:any)=>{console.log(e.username)
        // })
        socket.join("/" + location);
        const sockets = yield io.in("/" + location).fetchSockets();
        for (const socket of sockets) {
            memory.push({ location: socket.location, user: socket.username });
            // console.log(socket.rooms)
            // await new Promise((res)=> setTimeout(res,200));
            // socket.broadcast.to("/1").emit("socketCommit",socket.username)
            // console.log(socket.username+"refSockets")
        }
        for (const socket of sockets) {
            socket.emit("socketCommit", memory);
        }
        // await new Promise(res=>setTimeout(res,1000))
        // console.log(memory)
        // memory.map((e)=>{
        //   console.log(e.location+"helll")
        //   socket.to("/"+e.location).emit("commit",e.user);
        // })
    }));
}));
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
    try {
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
    }
    catch (e) {
        console.log(e);
    }
}));
app2.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
    }
    catch (e) {
        console.log(e);
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
    try {
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
    }
    catch (e) {
        console.log(e);
    }
}));
app2.post("/api/v1/savedocwithops", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    const decoded = jsonwebtoken_1.default.verify(token, "123123");
    const body = req.body;
    const docs = yield prisma.docs.update({
        where: {
            id: body.id
        },
        data: { image: body.image, ops: body.ops },
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
    if ((decoded === null || decoded === void 0 ? void 0 : decoded.id) == null)
        return res.json({ msg: "error" });
    const docs = yield prisma.docs.findFirst({
        where: {
            id: body.id,
        }
    });
    res.json({
        msg: "got it",
        docs
    });
}));
app2.post("/api/v1/userConnectionDoc", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    const decoded = jsonwebtoken_1.default.verify(token, "123123");
    const body = req.body;
    if ((decoded === null || decoded === void 0 ? void 0 : decoded.id) == null)
        return res.json({ msg: "error" });
    const finduserwithdocs = yield prisma.userConnectedToDocs.findFirst({
        where: {
            userId: decoded === null || decoded === void 0 ? void 0 : decoded.id,
            docsId: body.docsId
        }
    });
    if (finduserwithdocs === null) {
        const createuserwithdocs = yield prisma.userConnectedToDocs.create({
            data: {
                userId: decoded === null || decoded === void 0 ? void 0 : decoded.id,
                docsId: body.docsId
            }
        });
        return res.json({
            msg: "created",
            createuserwithdocs
        });
    }
    res.json({
        msg: "already exist",
        finduserwithdocs
    });
}));
app2.get("/api/v1/getdocswithconnecteduser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    const decoded = jsonwebtoken_1.default.verify(token, "123123");
    if ((decoded === null || decoded === void 0 ? void 0 : decoded.id) == null)
        return res.json({ msg: "error" });
    const user = yield prisma.userConnectedToDocs.findMany({
        where: {
            userId: decoded === null || decoded === void 0 ? void 0 : decoded.id,
        },
        include: {
            docs: true
        }
    });
    res.json({
        user
    });
}));
app2.post("/api/v1/getspecificdocscontouser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //   const token=req.cookies.token;
    //   const decoded= jwt.verify(token, "123123") as JwtPayload;
    //  const body=req.body
    //if(decoded?.id==null) return res.json({msg:"error"})
    const start = performance.now();
    const user = yield prisma.userConnectedToDocs.findMany({
        where: {
            userId: 1,
            docsId: 1
        },
        include: {
            docs: true
        }
    });
    const end = performance.now();
    console.log(user[0].docs.ops);
    res.json({
        user,
        time: start - end
    });
}));
app2.post("/api/v2/cachedDocs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const start = performance.now();
    const token = req.cookies.token;
    const decoded = jsonwebtoken_1.default.verify(token, "123123");
    const body = req.body;
    if ((decoded === null || decoded === void 0 ? void 0 : decoded.id) == null)
        return res.json({ msg: "error" });
    yield redis_1.default.get(body.docsId, function (error, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const end = performance.now();
            if (value != null) {
                return res.json({
                    response: value,
                    time: end - start
                });
            }
            else {
                const user = yield prisma.userConnectedToDocs.findMany({
                    where: {
                        userId: decoded === null || decoded === void 0 ? void 0 : decoded.id,
                        docsId: body.docsId
                    },
                    include: {
                        docs: true
                    }
                });
                console.log(user[0].docs.ops);
                yield redis_1.default.set(body.docsId, user[0].docs.ops, { Ex: "40000" });
                return res.json({
                    response: user[0].docs.ops,
                });
            }
        });
    });
}));
app2.get("/trial", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var valu;
    const msg = yield redis_1.default.get("msg", function (error, value) {
        valu = value;
        res.json({
            msgaage: valu,
        });
    });
}));
app2.listen(3000);
