import {io} from"socket.io-client"
const location=window.location.href.split("/")[3]
export const  socket= io("http://localhost:8080")